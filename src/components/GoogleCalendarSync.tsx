'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { SyllabusEvent } from '@/types'
import React from 'react'

interface GoogleCalendarSyncProps {
  events: SyllabusEvent[]
}

export default function GoogleCalendarSync({ events }: GoogleCalendarSyncProps) {
  const [isAuthorizing, setIsAuthorizing] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{
    success: boolean
    message: string
    results?: any[]
  } | null>(null)

  const handleGoogleAuth = () => {
    setIsAuthorizing(true)
    setSyncStatus(null)

    // Google OAuth2 flow
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/callback`
    const scope = 'https://www.googleapis.com/auth/calendar'
    
    if (!clientId) {
      setSyncStatus({
        success: false,
        message: 'Google Calendar integration not configured. Please set up OAuth credentials.'
      })
      setIsAuthorizing(false)
      return
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`

    // Store events in sessionStorage for after auth
    sessionStorage.setItem('pendingEvents', JSON.stringify(events))
    
    // Redirect to Google OAuth
    window.location.href = authUrl
  }

  const syncToGoogleCalendar = async (accessToken: string) => {
    setIsSyncing(true)
    setSyncStatus(null)

    try {
      const response = await fetch('/api/google-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          accessToken
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync with Google Calendar')
      }

      const successCount = result.results?.filter((r: any) => r.success).length || 0
      const failureCount = result.results?.length - successCount || 0

      setSyncStatus({
        success: successCount > 0,
        message: `Successfully synced ${successCount} events${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
        results: result.results
      })
    } catch (error) {
      setSyncStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sync events'
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Check for auth code in URL (after OAuth redirect)
  useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authCode = urlParams.get('code')
    
    if (authCode) {
      // Exchange auth code for access token
      // In a real implementation, you'd call your backend to exchange the code
      // For demo purposes, we'll show a success message
      setSyncStatus({
        success: true,
        message: 'Google Calendar authorization successful! Click sync to continue.'
      })
      setIsAuthorizing(false)
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  })

  if (events.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Google Calendar Sync</h3>
        </div>
        <span className="text-sm text-gray-500">{events.length} events</span>
      </div>

      <p className="text-gray-600 mb-4">
        Sync your syllabus events directly to Google Calendar for easy access across all your devices.
      </p>

      {syncStatus && (
        <div className={`p-3 rounded-lg mb-4 ${
          syncStatus.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {syncStatus.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <p className={`text-sm ${
              syncStatus.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {syncStatus.message}
            </p>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleGoogleAuth}
          disabled={isAuthorizing || isSyncing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAuthorizing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CalendarIcon className="h-4 w-4" />
          )}
          <span>
            {isAuthorizing ? 'Authorizing...' : 'Sync to Google Calendar'}
          </span>
        </button>

        <button
          onClick={() => {
            // Generate ICS file for download
            const icsContent = generateICSFile(events)
            const blob = new Blob([icsContent], { type: 'text/calendar' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'syllabus-calendar.ics'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Download .ics file
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>• Google Calendar sync requires authentication</p>
        <p>• .ics files work with Outlook, Apple Calendar, and other calendar apps</p>
      </div>
    </div>
  )
}

function generateICSFile(events: SyllabusEvent[]): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Syllabus Calendar//EN',
    'CALSCALE:GREGORIAN',
  ]

  for (const event of events) {
    const start = event.date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const end = new Date(event.date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    ics.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@syllabuscalendar.com`,
      `DTSTAMP:${now}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `CATEGORIES:${event.type.toUpperCase()}`,
      'END:VEVENT'
    )
  }

  ics.push('END:VCALENDAR')
  
  return ics.join('\r\n')
}