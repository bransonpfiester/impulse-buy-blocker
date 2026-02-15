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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {item.imageUrl && (
        <div className="mb-4 rounded overflow-hidden">
          <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
      <p className="text-2xl font-bold text-indigo-600 mb-3">${item.price.toFixed(2)}</p>
      
      {item.notes && (
        <p className="text-gray-600 text-sm mb-3">{item.notes}</p>
      )}

      {item.status === 'waiting' && (
        <div className="mb-4">
          <TimerDisplay addedAt={item.addedAt} onExpired={onRefresh} />
        </div>
      )}

      {item.status === 'waiting' && canDecide && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onMarkSaved(item.id)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            I don't need it
          </button>
          <button
            onClick={() => onBuyIt(item.id)}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Buy it
          </button>
        </div>
      )}

      {item.status === 'saved' && (
        <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
          <p className="text-green-700 font-semibold text-center">✓ ${item.price.toFixed(2)} saved!</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        Added {new Date(item.addedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
