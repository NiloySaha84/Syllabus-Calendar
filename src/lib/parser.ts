import * as chrono from 'chrono-node'
import { SyllabusEvent, ParseResult } from '@/types'
import { format } from 'date-fns'

export async function parseSyllabusText(text: string): Promise<ParseResult> {
  try {
    const cleanText = text.replace(/\s+/g, ' ').trim()
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    const events: SyllabusEvent[] = []
    
    for (const line of lines) {
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
    
    // AI enhancement if OpenAI API key is available
    if (process.env.OPENAI_API_KEY && events.length > 0) {
      try {
        await enhanceEventsWithOpenAI(events, cleanText)
      } catch (error) {
        console.warn('OpenAI enhancement failed, using fallback classification:', error)
      }
    }
    
    // Remove duplicates and sort
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

function classifyEventType(text: string): 'assignment' | 'exam' | 'reading' | 'other' {
  const lowerText = text.toLowerCase()
  
  if (lowerText.match(/\b(assignment|homework|hw|project|paper|essay|report|submit|due)\b/)) {
    return 'assignment'
  }
  
  if (lowerText.match(/\b(exam|test|quiz|midterm|final|assessment)\b/)) {
    return 'exam'
  }
  
  if (lowerText.match(/\b(reading|read|chapter|pages?|textbook|article|book)\b/)) {
    return 'reading'
  }
  
  return 'other'
}

function extractEventTitle(line: string, type: string): string {
  let title = line.replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(,?\s+\d{4})?\b/gi, '')
  title = title.replace(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g, '')
  title = title.replace(/\b\d{1,2}-\d{1,2}-\d{2,4}\b/g, '')
  title = title.replace(/[-–—:]+/g, '').trim()
  title = title.replace(/\s+/g, ' ')
  
  if (title.length < 5) {
    const typeMap: Record<string, string> = {
      assignment: 'Assignment',
      exam: 'Exam',
      reading: 'Reading',
      other: 'Event'
    }
    title = typeMap[type] || 'Event'
  }
  
  return title.charAt(0).toUpperCase() + title.slice(1)
}

function isValidAcademicDate(date: Date): boolean {
  const now = new Date()
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  
  return date >= sixMonthsAgo && date <= oneYearFromNow
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

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

async function enhanceEventsWithOpenAI(events: SyllabusEvent[], fullText: string): Promise<void> {
  if (!process.env.OPENAI_API_KEY) return
  
  try {
    // Dynamic import to avoid bundling OpenAI in client-side code
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
      
      if (Array.isArray(enhancedEvents)) {
        for (const enhanced of enhancedEvents) {
          const existingEvent = events.find(e => format(e.date, 'yyyy-MM-dd') === enhanced.date)
          if (existingEvent && enhanced.type && ['assignment', 'exam', 'reading', 'other'].includes(enhanced.type)) {
            existingEvent.type = enhanced.type
            if (enhanced.title && enhanced.title.length > 3) {
              existingEvent.title = enhanced.title
            }
            if (enhanced.description && enhanced.description.length > 5) {
              existingEvent.description = enhanced.description
            }
          }
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