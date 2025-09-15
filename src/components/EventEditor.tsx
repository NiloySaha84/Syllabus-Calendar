'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { X, Save, Trash2 } from 'lucide-react'
import { SyllabusEvent } from '@/types'
import React from 'react'

interface EventEditorProps {
  event: SyllabusEvent
  onSave: (updatedEvent: SyllabusEvent) => void
  onDelete: (eventId: string) => void
  onClose: () => void
}

export default function EventEditor({ event, onSave, onDelete, onClose }: EventEditorProps) {
  const [title, setTitle] = useState(event.title)
  const [type, setType] = useState(event.type)
  const [date, setDate] = useState(format(event.date, 'yyyy-MM-dd'))
  const [description, setDescription] = useState(event.description || '')

  const handleSave = () => {
    const updatedEvent: SyllabusEvent = {
      ...event,
      title,
      type: type as 'assignment' | 'exam' | 'reading' | 'other',
      date: new Date(date),
      description
    }
    onSave(updatedEvent)
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Event</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="reading">Reading</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event description"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}