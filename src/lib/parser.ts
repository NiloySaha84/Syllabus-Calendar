import * as chrono from 'chrono-node'
import { SyllabusEvent, ParseResult } from '@/types'
import { v4 as uuidv4 } from 'crypto'
import { format } from 'date-fns'

/**
 * Parse syllabus text and extract events using hybrid approach:
 * 1. Extract dates using chrono-node
 * 2. Classify event types using OpenAI API
 */
export async function parseSyllabusText(text: string): Promise<ParseResult> {
  try {
    // Clean the text
    const cleanText = text.replace(/\s+/g, ' ').trim()
    
    // Split into lines for processing
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    const events: SyllabusEvent[] = []
    
    for (const line of lines) {
      // Use chrono to find dates in each line
      const dateMatches = chrono.parse(line, new Date())
      
      for (const match of dateMatches) {
        if (match.start.date() && isValidAcademicDate(match.start.date())) {
          const eventType = classifyEventType(line)
          const title = extractEventTitle(line, eventType)
          
          const event: SyllabusEvent = {
            id: generateId(),
            title,
            date: match.start.date(),
            type: eventType,
            description: line.length > 100 ? line.substring(0, 100) + '...' : line,
            originalText: line
          }
          
          events.push(event)
        }
      }
    }
    
    // If OpenAI API is available, enhance classification
    if (process.env.OPENAI_API_KEY && events.length > 0) {
      try {
        await enhanceEventsWithOpenAI(events, cleanText)
      } catch (error) {
        console.warn('OpenAI enhancement failed, using fallback classification:', error)
      }
    }
    
    // Remove duplicates and sort by date
    const uniqueEvents = removeDuplicates(events)
    uniqueEvents.sort((a, b) => a.date.getTime() - b.date.getTime())
    
    return {
      events: uniqueEvents,
      success: true
    }
  } catch (error) {
    console.error('Parsing error:', error)
    return {
      events: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Classify event type based on keywords
 */
function classifyEventType(text: string): 'assignment' | 'exam' | 'reading' | 'other' {
  const lowerText = text.toLowerCase()
  
  // Assignment keywords
  if (lowerText.match(/\b(assignment|homework|hw|project|paper|essay|report|submit|due)\b/)) {
    return 'assignment'
  }
  
  // Exam keywords
  if (lowerText.match(/\b(exam|test|quiz|midterm|final|assessment)\b/)) {
    return 'exam'
  }
  
  // Reading keywords
  if (lowerText.match(/\b(reading|read|chapter|pages?|textbook|article|book)\b/)) {
    return 'reading'
  }
  
  return 'other'
}

/**
 * Extract meaningful title from the line
 */
function extractEventTitle(line: string, type: string): string {
  // Remove common date patterns
  let title = line.replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(,?\s+\d{4})?\b/gi, '')
  title = title.replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, '')
  title = title.replace(/\b\d{1,2}-\d{1,2}-\d{2,4}\b/g, '')
  
  // Clean up
  title = title.replace(/[-–—:]+/g, '').trim()
  title = title.replace(/\s+/g, ' ')
  
  // If title is too short or generic, create a better one
  if (title.length < 5) {
    const typeMap = {
      assignment: 'Assignment',
      exam: 'Exam',
      reading: 'Reading',
      other: 'Event'
    }
    title = typeMap[type as keyof typeof typeMap] || 'Event'
  }
  
  // Capitalize first letter
  return title.charAt(0).toUpperCase() + title.slice(1)
}

/**
 * Check if date is reasonable for academic calendar
 */
function isValidAcademicDate(date: Date): boolean {
  const now = new Date()
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  
  return date >= sixMonthsAgo && date <= oneYearFromNow
}

/**
 * Generate unique ID using simple method
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Remove duplicate events based on date and similarity of title
 */
function removeDuplicates(events: SyllabusEvent[]): SyllabusEvent[] {
  const unique: SyllabusEvent[] = []
  
  for (const event of events) {
    const isDuplicate = unique.some(existing => 
      Math.abs(existing.date.getTime() - event.date.getTime()) < 24 * 60 * 60 * 1000 && // Same day
      (existing.title.toLowerCase().includes(event.title.toLowerCase()) || 
       event.title.toLowerCase().includes(existing.title.toLowerCase()))
    )
    
    if (!isDuplicate) {
      unique.push(event)
    }
  }
  
  return unique
}

/**
 * Enhance events using OpenAI API for better classification
 */
async function enhanceEventsWithOpenAI(events: SyllabusEvent[], fullText: string): Promise<void> {
  if (!process.env.OPENAI_API_KEY) return
  
  try {
    const { OpenAI } = await import('openai')
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    const eventsText = events.map(e => `${format(e.date, 'yyyy-MM-dd')}: ${e.originalText}`).join('\n')
    
    const prompt = `
Analyze this syllabus content and classify each event. Return a JSON array with objects containing:
- date (YYYY-MM-DD format)
- type (assignment|exam|reading|other)  
- title (clear, concise title)
- description (brief description)

Events to classify:
${eventsText}

Full syllabus context:
${fullText.substring(0, 2000)}

Return only valid JSON array, no other text.
`
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 1500
    })
    
    const content = response.choices[0]?.message?.content
    if (!content) return
    
    try {
      const enhancedEvents = JSON.parse(content)
      
      // Update existing events with enhanced data
      for (const enhanced of enhancedEvents) {
        const existingEvent = events.find(e => format(e.date, 'yyyy-MM-dd') === enhanced.date)
        if (existingEvent) {
          existingEvent.type = enhanced.type || existingEvent.type
          existingEvent.title = enhanced.title || existingEvent.title
          existingEvent.description = enhanced.description || existingEvent.description
        }
      }
    } catch (parseError) {
      console.warn('Failed to parse OpenAI response:', parseError)
    }
  } catch (error) {
    console.warn('OpenAI API error:', error)
    throw error
  }
}