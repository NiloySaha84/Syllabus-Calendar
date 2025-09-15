'use client'

import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { SyllabusEvent } from '@/types'
interface FileUploadProps {
  onEventsExtracted: (events: SyllabusEvent[]) => void
}

export default function FileUpload({ onEventsExtracted }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse file')
      }

      if (result.success && result.events.length > 0) {
        // Convert date strings back to Date objects
        const events = result.events.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }))
        onEventsExtracted(events)
      } else {
        throw new Error('No events found in the syllabus')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isLoading
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isLoading ? 'Processing...' : 'Upload your syllabus'}
            </h3>
            <p className="text-gray-500 mt-2">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag & drop a PDF or TXT file, or click to browse'
              }
            </p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>TXT</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}