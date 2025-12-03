'use client'

import { useState, useEffect } from 'react'
import { InventoryItem, InventoryUnit } from '@/lib/entities/types'

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [showToBuyOnly, setShowToBuyOnly] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: InventoryUnit.PIECES,
    category: '',
    expiry_date: '',
    notes: ''
  })

  // Fetch inventory items from API
  const fetchItems = async () => {
    try {
      setLoading(true)
      let url = '/api/inventory'
      
      if (showToBuyOnly) {
        url = '/api/inventory/to-buy'
      } else if (filterCategory) {
        url = `/api/inventory?category=${encodeURIComponent(filterCategory)}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory items')
      }

      const data = await response.json()
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add or update inventory item
  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.quantity) {
      alert('Please fill in the name and quantity fields')
      return
    }

    try {
      const url = editingItem ? `/api/inventory/${editingItem.id}` : '/api/inventory'
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          expiry_date: formData.expiry_date || null
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingItem ? 'update' : 'add'} inventory item`)
      }

      // Reset form and refresh items
      resetForm()
      fetchItems()
    } catch (error) {
      console.error('Error saving item:', error)
      alert(`Error ${editingItem ? 'updating' : 'adding'} inventory item`)
    }
  }

  // Delete inventory item
  const deleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete inventory item')
      }

      fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting inventory item')
    }
  }

  // Toggle to buy status
  const toggleToBuy = async (id: number) => {
    try {
      const response = await fetch(`/api/inventory/${id}/toggle-to-buy`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle to buy status')
      }

      fetchItems()
    } catch (error) {
      console.error('Error toggling to buy:', error)
      alert('Error updating to buy status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: '',
      unit: InventoryUnit.PIECES,
      category: '',
      expiry_date: '',
      notes: ''
    })
    setShowForm(false)
    setEditingItem(null)
  }

  const startEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      unit: item.unit,
      category: item.category || '',
      expiry_date: item.expiry_date || '',
      notes: item.notes || ''
    })
    setEditingItem(item)
    setShowForm(true)
  }

  // Load items on component mount
  useEffect(() => {
    fetchItems()
  }, [filterCategory, showToBuyOnly])

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No expiry'
    return new Date(dateString).toLocaleDateString('en-US')
  }

  const isExpiringSoon = (dateString: string | undefined) => {
    if (!dateString) return false
    const expiryDate = new Date(dateString)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0
  }

  const isExpired = (dateString: string | undefined) => {
    if (!dateString) return false
    const expiryDate = new Date(dateString)
    const today = new Date()
    return expiryDate < today
  }

  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Boat Inventory</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <button
          onClick={() => setShowToBuyOnly(!showToBuyOnly)}
          className={`px-4 py-2 rounded-md transition-colors ${
            showToBuyOnly 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          {showToBuyOnly ? 'Show All' : 'Show To Buy Only'}
        </button>
      </div>

      {/* Add/Edit Item Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={saveItem} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Coffee, Milk, Rope, etc."
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Food, Safety, Tools, etc."
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as InventoryUnit })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {Object.values(InventoryUnit).map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiry_date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional information..."
              />
            </div>

            <div className="flex justify-end space-x-3">
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
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Items List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No inventory items yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 hover:underline"
            >
              Add your first item
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-lg shadow-md p-4 border-l-4 relative ${
                  item.to_buy
                    ? 'border-red-500 ring-2 ring-red-200'
                    : isExpired(item.expiry_date) 
                    ? 'border-red-500' 
                    : isExpiringSoon(item.expiry_date) 
                    ? 'border-yellow-500' 
                    : 'border-green-500'
                }`}
              >
                {item.to_buy && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    TO BUY
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 pr-16">{item.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => toggleToBuy(item.id!)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        item.to_buy 
                          ? 'text-red-600 bg-red-100 hover:bg-red-200 border border-red-300' 
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300'
                      }`}
                      title={item.to_buy ? 'Remove from shopping list' : 'Add to shopping list'}
                    >
                      🛒 To buy
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteItem(item.id!)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {item.quantity} {item.unit}
                </p>
                
                {item.category && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Category:</span> {item.category}
                  </p>
                )}
                
                <p className={`text-sm mb-2 ${
                  isExpired(item.expiry_date) 
                    ? 'text-red-600 font-medium' 
                    : isExpiringSoon(item.expiry_date) 
                    ? 'text-yellow-600 font-medium' 
                    : 'text-gray-600'
                }`}>
                  <span className="font-medium">Expires:</span> {formatDate(item.expiry_date)}
                  {isExpired(item.expiry_date) && ' (EXPIRED)'}
                  {isExpiringSoon(item.expiry_date) && !isExpired(item.expiry_date) && ' (Soon)'}
                </p>
                
                {item.notes && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {item.notes}
                  </p>
                )}
                
                <p className="text-xs text-gray-400 mt-2">
                  Added: {formatDate(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}