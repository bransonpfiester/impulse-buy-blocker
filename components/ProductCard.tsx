'use client';

import { useState, useEffect } from 'react';
import type { Item } from '@/app/page';

interface ProductCardProps {
  item: Item;
  onMarkSaved: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({ item, onMarkSaved, onDelete }: ProductCardProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const waitMs = item.waitTime * 60 * 60 * 1000;
      const endTime = item.addedAt + waitMs;
      const remaining = endTime - now;

      if (remaining <= 0) {
        setIsReady(true);
        setTimeRemaining('Ready!');
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        if (hours > 24) {
          const days = Math.floor(hours / 24);
          setTimeRemaining(`${days}d ${hours % 24}h`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [item.addedAt, item.waitTime]);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.status === 'waiting' && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
            isReady 
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            {timeRemaining}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
          {item.name}
        </h3>
        <p className="text-lg font-bold text-gray-900 mb-3">
          ${item.price.toFixed(2)}
        </p>

        {/* Actions */}
        {item.status === 'waiting' && (
          <div className="space-y-2">
            {isReady && (
              <button
                onClick={() => onMarkSaved(item.id)}
                className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                ✓ I Resisted!
              </button>
            )}
            <button
              onClick={() => onDelete(item.id)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              {isReady ? 'I Bought It' : 'Remove'}
            </button>
          </div>
        )}

        {item.status === 'saved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
            <p className="text-green-700 text-xs font-medium">✓ Money Saved!</p>
          </div>
        )}
      </div>
    </div>
  );
}
