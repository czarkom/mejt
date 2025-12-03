'use client'

import { useState, useEffect } from 'react'
import { Booking, BookingPerson, BookingStatus } from '@/lib/entities/types'

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [formData, setFormData] = useState({
    person: BookingPerson.MAMA,
    start_date: '',
    end_date: '',
    comment: '',
    status: BookingStatus.CONFIRMED
  })

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add or update booking
  const saveBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.start_date || !formData.end_date) {
      alert('Please fill in the start and end dates')
      return
    }

    // Validate date range
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      alert('Start date must be before or equal to end date')
      return
    }

    try {
      const url = editingBooking ? `/api/bookings/${editingBooking.id}` : '/api/bookings'
      const method = editingBooking ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${editingBooking ? 'update' : 'create'} booking`)
      }

      // Reset form and refresh bookings
      resetForm()
      fetchBookings()
    } catch (error) {
      console.error('Error saving booking:', error)
      alert(error instanceof Error ? error.message : `Error ${editingBooking ? 'updating' : 'creating'} booking`)
    }
  }

  // Delete booking
  const deleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return
    }

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete booking')
      }

      fetchBookings()
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Error deleting booking')
    }
  }

  const resetForm = () => {
    setFormData({
      person: BookingPerson.MAMA,
      start_date: '',
      end_date: '',
      comment: '',
      status: BookingStatus.CONFIRMED
    })
    setShowForm(false)
    setEditingBooking(null)
  }

  const startEdit = (booking: Booking) => {
    setFormData({
      person: booking.person,
      start_date: booking.start_date,
      end_date: booking.end_date,
      comment: booking.comment || '',
      status: booking.status
    })
    setEditingBooking(booking)
    setShowForm(true)
  }

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [])

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateShort = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.some(booking => 
      booking.status === 'confirmed' &&
      dateStr >= booking.start_date && 
      dateStr <= booking.end_date
    )
  }

  const getBookingForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.find(booking => 
      booking.status === 'confirmed' &&
      dateStr >= booking.start_date && 
      dateStr <= booking.end_date
    )
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth)
    const firstDay = getFirstDayOfMonth(selectedMonth)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
      const isBooked = isDateBooked(date)
      const booking = getBookingForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[60px] border border-gray-200 ${
            isToday ? 'bg-blue-100 border-blue-300' : ''
          } ${isBooked ? 'bg-red-100' : 'bg-white'}`}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
            {day}
          </div>
          {booking && (
            <div className="text-xs text-red-700 mt-1 font-medium">
              {booking.person}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const changeMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const upcomingBookings = bookings
    .filter(booking => new Date(booking.start_date) >= new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Boat Calendar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Booking'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => changeMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ← Previous
              </button>
              <h2 className="text-xl font-semibold">
                {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => changeMonth('next')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0 border border-gray-200">
              {renderCalendar()}
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-gray-200 mr-2"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 mr-2"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Bookings</h3>
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-600">No upcoming bookings</p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-800">{booking.person}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(booking)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteBooking(booking.id!)}
                          className="text-red-600 hover:text-red-800 text-xs"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDateShort(booking.start_date)} - {formatDateShort(booking.end_date)}
                    </p>
                    {booking.comment && (
                      <p className="text-xs text-gray-500 mt-1">{booking.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Booking Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingBooking ? 'Edit Booking' : 'New Booking'}
            </h2>
            <form onSubmit={saveBooking} className="space-y-4">
              <div>
                <label htmlFor="person" className="block text-sm font-medium text-gray-700 mb-1">
                  Person *
                </label>
                <select
                  id="person"
                  value={formData.person}
                  onChange={(e) => setFormData({ ...formData, person: e.target.value as BookingPerson })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {Object.values(BookingPerson).map(person => (
                    <option key={person} value={person}>{person}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.values(BookingStatus).map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional notes about this booking..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Bookings List */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Bookings</h3>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No bookings yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:underline"
            >
              Create your first booking
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-4 border border-gray-200 rounded">
                <div>
                  <p className="font-medium text-gray-800">{booking.person}</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                  </p>
                  {booking.comment && (
                    <p className="text-sm text-gray-500 mt-1">{booking.comment}</p>
                  )}
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(booking)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteBooking(booking.id!)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}