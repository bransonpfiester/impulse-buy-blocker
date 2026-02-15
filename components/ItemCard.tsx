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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        
        {/* Image */}
        {item.imageUrl && (
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
            {item.name}
          </h3>
          <p className="text-2xl font-bold text-blue-600 mb-2">
            ${item.price.toFixed(2)}
          </p>
          {item.notes && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.notes}
            </p>
          )}

          {/* Timer */}
          {item.status === 'waiting' && (
            <div className="mb-3">
              <TimerDisplay addedAt={item.addedAt} onExpired={onRefresh} />
            </div>
          )}

          {/* Actions */}
          {item.status === 'waiting' && canDecide && (
            <div className="flex gap-2">
              <button
                onClick={() => onMarkSaved(item.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Don't Need It
              </button>
              <button
                onClick={() => onBuyIt(item.id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Buy It
              </button>
            </div>
          )}

          {/* Saved Badge */}
          {item.status === 'saved' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
              <span>✓</span>
              <span>Saved ${item.price.toFixed(2)}</span>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3">
            {new Date(item.addedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
