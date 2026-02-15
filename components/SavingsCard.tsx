'use client';

interface SavingsCardProps {
  totalSaved: number;
  itemsSaved: number;
}

export default function SavingsCard({ totalSaved, itemsSaved }: SavingsCardProps) {
  const percentage = Math.min(100, (itemsSaved / Math.max(itemsSaved + 1, 10)) * 100);

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-lg p-8 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-green-100 text-sm font-medium mb-1">Total Saved</p>
          <p className="text-white text-5xl font-bold mb-2">
            ${totalSaved.toFixed(2)}
          </p>
          <p className="text-green-100 text-sm">
            {itemsSaved} {itemsSaved === 1 ? 'purchase' : 'purchases'} avoided
          </p>
        </div>
        
        <div className="relative w-32 h-32">
          {/* Circular Progress */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
