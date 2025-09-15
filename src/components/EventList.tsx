'use client'

import { format } from 'date-fns'
import { Calendar, BookOpen, FileText, Clock, Edit } from 'lucide-react'
import { SyllabusEvent } from '@/types'
import React from 'react'

interface EventListProps {
  events: SyllabusEvent[]
  onEventEdit?: (event: SyllabusEvent) => void
}

export default function EventList({ events, onEventEdit }: EventListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4" />
      case 'exam':
        return <Clock className="h-4 w-4" />
      case 'reading':
        return <BookOpen className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'exam':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'reading':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500">Upload a syllabus to see your schedule</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Schedule ({events.length} events)
        </h2>
      </div>
      
      <div className="divide-y max-h-96 overflow-y-auto">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onEventEdit?.(event)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-lg border ${getTypeColor(event.type)}`}>
                  {getTypeIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(event.date, 'EEEE, MMMM d, yyyy')}
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getTypeColor(event.type)}`}>
                  {event.type}
                </span>
                {onEventEdit && (
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}