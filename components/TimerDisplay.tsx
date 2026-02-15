'use client';

import { useEffect, useState } from 'react';
import { getTimeRemaining } from '@/lib/storage';

interface TimerDisplayProps {
  addedAt: number;
  onExpired?: () => void;
}

export default function TimerDisplay({ addedAt, onExpired }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(addedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(addedAt);
      setTimeLeft(remaining);
      
      if (remaining === 0 && onExpired) {
        onExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [addedAt, onExpired]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  if (timeLeft === 0) {
    return <div className="text-green-600 font-semibold">✓ Ready to decide!</div>;
  }

  return (
    <div className="text-gray-700 font-mono text-sm">
      {hours}h {minutes}m {seconds}s remaining
    </div>
  );
}
