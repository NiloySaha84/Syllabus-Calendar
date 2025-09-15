import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { SyllabusEvent } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { events, accessToken } = await request.json()

    if (!accessToken || !events?.length) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    oauth2Client.setCredentials({ access_token: accessToken })

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    const results = []

    for (const event of events as SyllabusEvent[]) {
      try {
        // Set event time to 9 AM on the given date
        const startDate = new Date(event.date)
        startDate.setHours(9, 0, 0, 0)
        
        const endDate = new Date(startDate)
        endDate.setHours(10, 0, 0, 0) // 1 hour duration

        const colorId = getColorId(event.type)

        const googleEvent = {
          summary: event.title,
          description: event.description || event.originalText || '',
          start: {
            dateTime: startDate.toISOString(),
            timeZone: 'America/New_York', // Default timezone
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: 'America/New_York',
          },
          colorId,
        }

        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: googleEvent,
        })

        results.push({
          eventId: event.id,
          googleEventId: response.data.id,
          success: true,
        })
      } catch (error) {
        console.error(`Failed to create event ${event.id}:`, error)
        results.push({
          eventId: event.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Google Calendar sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync with Google Calendar' },
      { status: 500 }
    )
  }
}

function getColorId(type: string): string {
  // Google Calendar color IDs
  switch (type) {
    case 'assignment': return '9' // Blue
    case 'exam': return '11' // Red
    case 'reading': return '10' // Green
    default: return '8' // Gray
  }
}