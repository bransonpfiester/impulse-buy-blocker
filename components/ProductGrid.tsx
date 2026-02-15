'use client';

import { useEffect, useState } from 'react';
import type { Item } from '@/app/page';
import ProductCard from './ProductCard';

interface ProductGridProps {
  items: Item[];
  onMarkSaved: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductGrid({ items, onMarkSaved, onDelete }: ProductGridProps) {
  const [, setTick] = useState(0);

  // Update every second to refresh timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <p className="text-xl text-gray-700 font-medium">No items yet</p>
        <p className="text-gray-500 mt-2">Add items you're tempted to buy</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(item => (
        <ProductCard 
          key={item.id}
          item={item}
          onMarkSaved={onMarkSaved}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
