export interface SyllabusEvent {
    id: string
    title: string
    date: Date
    type: 'assignment' | 'exam' | 'reading' | 'other'
    description?: string
    originalText?: string
  }
  
  export interface ParseResult {
    events: SyllabusEvent[]
    success: boolean
    error?: string
  }
  
  export interface GoogleCalendarEvent {
    summary: string
    description?: string
    start: {
      dateTime: string
      timeZone: string
    }
    end: {
      dateTime: string
      timeZone: string
    }
    colorId?: string
  }