'use client';

import { useEffect, useState } from 'react';
import { AppState, ImpulseItem } from '@/lib/types';
import { getAppState, addItem, markAsSaved, deleteItem, isWaitingPeriodOver, updateItemStatus } from '@/lib/storage';
import AddItemModal from '@/components/AddItemModal';
import ItemCard from '@/components/ItemCard';

export default function Home() {
  const [state, setState] = useState<AppState>({ items: [], totalSaved: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setState(getAppState());
  }, [refreshKey]);

  const handleAddItem = (item: { name: string; price: number; notes?: string; imageUrl?: string }) => {
    const newState = addItem(item);
    setState(newState);
  };

  const handleMarkSaved = (itemId: string) => {
    const newState = markAsSaved(itemId);
    setState(newState);
  };

  const handleBuyIt = (itemId: string) => {
    const newState = deleteItem(itemId);
    setState(newState);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Auto-update expired items
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = getAppState();
      let updated = false;
      currentState.items.forEach(item => {
        if (item.status === 'waiting' && isWaitingPeriodOver(item.addedAt)) {
          updateItemStatus(item.id, 'ready');
          updated = true;
        }
      });
      if (updated) setRefreshKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const waitingItems = state.items.filter(item => item.status === 'waiting' || item.status === 'ready');
  const savedItems = state.items.filter(item => item.status === 'saved');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🛒</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            48-Hour Rule
          </h1>
          <p className="text-gray-600">
            Wait before you buy. Save money, avoid regret.
          </p>
        </div>

        {/* Savings Card */}
        {state.totalSaved > 0 && (
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 mb-10 text-white text-center shadow-lg">
            <p className="text-sm font-medium opacity-90 mb-1">Money Saved</p>
            <p className="text-6xl font-bold mb-2">${state.totalSaved.toFixed(2)}</p>
            <p className="opacity-90">{savedItems.length} items avoided</p>
          </div>
        )}

        {/* Waiting Period */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Waiting Period ({waitingItems.length})
          </h2>
          {waitingItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-3">📦</div>
              <p className="text-gray-500">No items waiting</p>
              <p className="text-sm text-gray-400 mt-1">Click + to add something</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {waitingItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onMarkSaved={handleMarkSaved}
                  onBuyIt={handleBuyIt}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          )}
        </div>

        {/* Saved Items */}
        {savedItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Saved ({savedItems.length})
            </h2>
            <div className="grid gap-4">
              {savedItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onMarkSaved={handleMarkSaved}
                  onBuyIt={handleBuyIt}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all active:scale-90"
        >
          +
        </button>

        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
        />
      </div>
    </div>
  );
}
