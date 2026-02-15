'use client';

import { useEffect, useState } from 'react';
import { AppState, ImpulseItem } from '@/lib/types';
import { getAppState, addItem, markAsSaved, deleteItem, isWaitingPeriodOver, updateItemStatus } from '@/lib/storage';
import AddItemModal from '@/components/AddItemModal';
import ItemCard from '@/components/ItemCard';
import SavingsDisplay from '@/components/SavingsDisplay';

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

  // Auto-update items that have expired
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

      if (updated) {
        setRefreshKey(prev => prev + 1);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const waitingItems = state.items.filter(item => item.status === 'waiting' || item.status === 'ready');
  const savedItems = state.items.filter(item => item.status === 'saved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-5xl mb-2">💸</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Impulse Buy Blocker
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Wait 48 hours before buying. Your wallet will thank you.
          </p>
        </header>

        {/* Savings Display */}
        <SavingsDisplay 
          totalSaved={state.totalSaved} 
          itemsSaved={savedItems.length} 
        />

        {/* Sections */}
        <div className="space-y-12 mt-12">
          {/* Waiting Period Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Waiting Period
              </h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                {waitingItems.length}
              </span>
            </div>
            {waitingItems.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🛍️</div>
                <p className="text-gray-500 text-lg">
                  No items waiting. Add something you want to buy!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </section>

          {/* Saved Section */}
          {savedItems.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  Money Saved
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {savedItems.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </section>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full w-16 h-16 shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-95"
          aria-label="Add new item"
        >
          +
        </button>

        {/* Add Item Modal */}
        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddItem}
        />
      </div>
    </div>
  );
}
