'use client'

import { useState, useEffect } from 'react'
import { LogEntry } from '@/lib/entities/types'

export default function LogbookPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    location: '',
    weather: ''
  })

  // Fetch logs from API
  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/logs')
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs')
      }

      const data = await response.json()
      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add new log entry
  const addLogEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      alert('Please fill in the title and content fields')
      return
    }

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to add log entry')
      }

      // Reset form and refresh logs
      setFormData({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        weather: ''
      })
      setShowForm(false)
      fetchLogs() // Refresh the list
    } catch (error) {
      console.error('Error adding log:', error)
      alert('Error adding log entry')
    }
  }

  // Load logs on component mount
  useEffect(() => {
    fetchLogs()
  }, [])

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dziennik pokładowy</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Anuluj' : '+ Dodaj wpis'}
        </button>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dodaj nowy wpis do dziennika</h2>
          <form onSubmit={addLogEntry} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tytuł *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tytuł rejsu"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Lokalizacja
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Port, współrzędne, itp."
                />
              </div>
              <div>
                <label htmlFor="weather" className="block text-sm font-medium text-gray-700 mb-1">
                  Pogoda
                </label>
                <input
                  type="text"
                  id="weather"
                  value={formData.weather}
                  onChange={(e) => setFormData({ ...formData, weather: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Słonecznie, 15 węzłów SW, itp."
                />
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Wpis dziennika *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opisz swój rejs, aktywności, obserwacje, konserwację, itp."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Anuluj
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Dodaj wpis
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Entries List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Ładowanie wpisów dziennika...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Nie ma jeszcze żadnych wpisów.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:underline"
            >
              Dodaj swój pierwszy wpis
            </button>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{log.title}</h3>
                  <p className="text-blue-600 font-medium">{formatDate(log.date)}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Dodano: {formatDate(log.created_at)}</p>
                </div>
              </div>

              {(log.location || log.weather) && (
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  {log.location && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600">📍 Lokalizacja:</span>
                      <span className="ml-1">{log.location}</span>
                    </div>
                  )}
                  {log.weather && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600">🌤️ Pogoda:</span>
                      <span className="ml-1">{log.weather}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{log.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}