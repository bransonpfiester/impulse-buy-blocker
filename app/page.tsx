'use client';

import { useState, useEffect } from 'react';
import SavingsCard from '@/components/SavingsCard';
import ProductGrid from '@/components/ProductGrid';
import AddItemButton from '@/components/AddItemButton';

export interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  addedAt: number;
  status: 'waiting' | 'saved';
  waitTime: number; // hours
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<'waiting' | 'saved'>('waiting');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const savedItems = localStorage.getItem('impulse-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  const saveItems = (newItems: Item[]) => {
    setItems(newItems);
    localStorage.setItem('impulse-items', JSON.stringify(newItems));
  };

  const addItem = (name: string, price: number, imageUrl: string, waitTime: number) => {
    const newItem: Item = {
      id: Date.now().toString(),
      name,
      price,
      imageUrl,
      addedAt: Date.now(),
      status: 'waiting',
      waitTime
    };
    saveItems([...items, newItem]);
    setShowAddModal(false);
  };

  const markAsSaved = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, status: 'saved' as const } : item
    );
    saveItems(updatedItems);
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const calculateSavings = () => {
    return items
      .filter(item => item.status === 'saved')
      .reduce((sum, item) => sum + item.price, 0);
  };

  const waitingItems = items.filter(i => i.status === 'waiting');
  const savedItems = items.filter(i => i.status === 'saved');
  const displayItems = activeTab === 'waiting' ? waitingItems : savedItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Impulse Buy Blocker</h1>
        <p className="text-sm text-gray-600 mt-1">Wait before you buy</p>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Savings Card */}
        <SavingsCard 
          totalSaved={calculateSavings()} 
          itemsSaved={savedItems.length}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('waiting')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'waiting'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Waiting ({waitingItems.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'saved'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Saved ({savedItems.length})
          </button>
        </div>

        {/* Product Grid */}
        <ProductGrid 
          items={displayItems}
          onMarkSaved={markAsSaved}
          onDelete={deleteItem}
        />

        {/* Add Button */}
        <AddItemButton 
          onClick={() => setShowAddModal(true)}
        />

        {/* Add Item Modal */}
        {showAddModal && (
          <AddItemModal 
            onClose={() => setShowAddModal(false)}
            onAdd={addItem}
          />
        )}
      </div>
    </div>
  );
}

function AddItemModal({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void;
  onAdd: (name: string, price: number, imageUrl: string, waitTime: number) => void;
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [waitTime, setWaitTime] = useState('24');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && price) {
      onAdd(
        name, 
        parseFloat(price), 
        imageUrl || 'https://via.placeholder.com/300x300/e5e7eb/6b7280?text=No+Image',
        parseInt(waitTime)
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What do you want to buy?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wait Time (hours)
            </label>
            <select
              value={waitTime}
              onChange={(e) => setWaitTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours (3 days)</option>
              <option value="168">1 week</option>
              <option value="720">30 days</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
