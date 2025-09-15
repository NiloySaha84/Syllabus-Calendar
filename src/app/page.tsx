'use client'

import { useState } from 'react'
import { BookOpen, Calendar as CalendarIcon, List, Eye } from 'lucide-react'
import { SyllabusEvent } from '@/types'
import FileUpload from '@/components/FileUpload'
import CalendarView from '@/components/CalendarView'
import EventList from '@/components/EventList'
import EventEditor from '@/components/EventEditor'
import GoogleCalendarSync from '@/components/GoogleCalendarSync'
import React from 'react'

export default function Home() {
  const [events, setEvents] = useState<SyllabusEvent[]>([])
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [editingEvent, setEditingEvent] = useState<SyllabusEvent | null>(null)

  const handleEventsExtracted = (extractedEvents: SyllabusEvent[]) => {
    setEvents(extractedEvents)
  }

  const handleEventSave = (updatedEvent: SyllabusEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e))
  }

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
  }

  const handleEventEdit = (event: SyllabusEvent) => {
    setEditingEvent(event)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Syllabus Calendar</h1>
                <p className="text-gray-600 text-sm">Transform your syllabus into a smart calendar</p>
              </div>
            </div>

            {events.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('calendar')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    view === 'calendar'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    view === 'list'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span>List</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          /* Upload Section */
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get started with your syllabus
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your syllabus PDF or text file, and we'll automatically extract all assignments, 
                exams, and readings into a beautiful calendar view.
              </p>
            </div>

            <FileUpload onEventsExtracted={handleEventsExtracted} />

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Parsing</h3>
                <p className="text-gray-600">
                  AI-powered extraction of dates, assignments, and exam information from your syllabus
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multiple Views</h3>
                <p className="text-gray-600">
                  View your schedule in calendar or list format, with easy editing capabilities
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Google Calendar Sync</h3>
                <p className="text-gray-600">
                  Sync events directly to Google Calendar or export as .ics for any calendar app
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Events Display */
          <div className="space-y-6">
            {/* Google Calendar Sync */}
            <GoogleCalendarSync events={events} />

            {/* Events Display */}
            {view === 'calendar' ? (
              <CalendarView events={events} onEventEdit={handleEventEdit} />
            ) : (
              <EventList events={events} onEventEdit={handleEventEdit} />
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {events.filter(e => e.type === 'assignment').length}
                  </div>
                  <div className="text-sm text-gray-600">Assignments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {events.filter(e => e.type === 'exam').length}
                  </div>
                  <div className="text-sm text-gray-600">Exams</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {events.filter(e => e.type === 'reading').length}
                  </div>
                  <div className="text-sm text-gray-600">Readings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {events.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Events</div>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-center">
              <button
                onClick={() => setEvents([])}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Upload new syllabus
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Event Editor Modal */}
      {editingEvent && (
        <EventEditor
          event={editingEvent}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  )
}