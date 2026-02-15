'use client';

import { ImpulseItem } from '@/lib/types';
import TimerDisplay from './TimerDisplay';
import { isWaitingPeriodOver } from '@/lib/storage';

interface ItemCardProps {
  item: ImpulseItem;
  onMarkSaved: (itemId: string) => void;
  onBuyIt: (itemId: string) => void;
  onRefresh: () => void;
}

export default function ItemCard({ item, onMarkSaved, onBuyIt, onRefresh }: ItemCardProps) {
  const canDecide = isWaitingPeriodOver(item.addedAt);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      {item.imageUrl && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          ${item.price.toFixed(2)}
        </p>
        
        {item.notes && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.notes}
          </p>
        )}

        {item.status === 'waiting' && (
          <div className="mb-4">
            <TimerDisplay addedAt={item.addedAt} onExpired={onRefresh} />
          </div>
        )}

        {item.status === 'waiting' && canDecide && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => onMarkSaved(item.id)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              Don't need it
            </button>
            <button
              onClick={() => onBuyIt(item.id)}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              Buy it
            </button>
          </div>
        )}

        {item.status === 'saved' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mt-4">
            <p className="text-green-700 font-bold text-center flex items-center justify-center gap-2">
              <span className="text-xl">✓</span>
              <span>${item.price.toFixed(2)} saved!</span>
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 text-center">
          Added {new Date(item.addedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
}
