'use client';

interface SavingsDisplayProps {
  totalSaved: number;
  itemsSaved: number;
}

export default function SavingsDisplay({ totalSaved, itemsSaved }: SavingsDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-10 text-white mb-8 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative text-center">
        <div className="inline-block mb-3">
          <span className="text-4xl">💰</span>
        </div>
        <h2 className="text-xl font-semibold opacity-95 mb-3 tracking-wide">Total Money Saved</h2>
        <p className="text-7xl font-bold mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          ${totalSaved.toFixed(2)}
        </p>
        <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full">
          <p className="text-lg font-medium">
            {itemsSaved} {itemsSaved === 1 ? 'impulse' : 'impulses'} avoided
          </p>
        </div>
      </div>
    </div>
  );
}
