'use client';

interface SavingsDisplayProps {
  totalSaved: number;
  itemsSaved: number;
}

export default function SavingsDisplay({ totalSaved, itemsSaved }: SavingsDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 rounded-2xl shadow-2xl p-8 text-white mb-8">
      <div className="text-center">
        <h2 className="text-lg font-medium opacity-90 mb-2">Total Money Saved</h2>
        <p className="text-6xl font-bold mb-4">${totalSaved.toFixed(2)}</p>
        <p className="text-xl opacity-90">
          {itemsSaved} {itemsSaved === 1 ? 'impulse' : 'impulses'} avoided
        </p>
      </div>
    </div>
  );
}
