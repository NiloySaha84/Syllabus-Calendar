'use client'

import { useState } from 'react'
import { Calendar, momentLocalizer, View, Event } from 'react-big-calendar'
import moment from 'moment'
import { SyllabusEvent } from '@/types'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

interface CalendarViewProps {
  events: SyllabusEvent[]
  onEventEdit?: (event: SyllabusEvent) => void
}

interface CalendarEvent extends Event {
  resource: SyllabusEvent
  className: string
}

export default function CalendarView({ events, onEventEdit }: CalendarViewProps) {
  const [view, setView] = useState<View>('month')

  // Transform events for react-big-calendar
  const calendarEvents: CalendarEvent[] = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.date,
    end: new Date(event.date.getTime() + 60 * 60 * 1000), // 1 hour duration
    resource: event,
    className: event.type // For CSS styling
  }))

  const handleSelectEvent = (event: CalendarEvent) => {
    if (onEventEdit && event.resource) {
      onEventEdit(event.resource)
    }
  }

  const eventStyleGetter = (event: CalendarEvent) => {
    const colors = {
      assignment: { backgroundColor: '#3b82f6', color: 'white' },
      exam: { backgroundColor: '#ef4444', color: 'white' },
      reading: { backgroundColor: '#10b981', color: 'white' },
      other: { backgroundColor: '#6b7280', color: 'white' }
    }

    const type = event.resource?.type || 'other'
    return {
      style: colors[type as keyof typeof colors]
    }
  }

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-sm border p-4">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={view}
        onView={setView}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        className="h-full"
        popup
        showMultiDayTimes
        step={60}
        views={['month', 'week', 'day', 'agenda']}
        messages={{
          next: "Next",
          previous: "Previous",
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          agenda: "List",
          noEventsInRange: "No events found",
          showMore: (total: number) => `+${total} more`
        }}
      />
    </div>
  )
}