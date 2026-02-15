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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Impulse Buy Blocker
          </h1>
          <p className="text-gray-600 text-lg">
            Wait 48 hours before buying. Your wallet will thank you.
          </p>
        </header>

        {/* Savings Display */}
        <SavingsDisplay 
          totalSaved={state.totalSaved} 
          itemsSaved={savedItems.length} 
        />

        {/* Sections */}
        <div className="space-y-12">
          {/* Waiting Period Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Waiting Period ({waitingItems.length})
            </h2>
            {waitingItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No items waiting. Add something you want to buy!
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Money Saved ({savedItems.length})
              </h2>
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
          className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-16 h-16 shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-110"
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
