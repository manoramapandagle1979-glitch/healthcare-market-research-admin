'use client';

import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  current: number;
  min?: number;
  max: number;
  optimal?: { min: number; max: number };
  className?: string;
}

export function CharacterCounter({ current, min, max, optimal, className }: CharacterCounterProps) {
  const getColor = () => {
    if (current === 0) return 'text-muted-foreground';
    if (optimal) {
      if (current >= optimal.min && current <= optimal.max) return 'text-green-600';
      if (current < optimal.min || current > optimal.max) return 'text-yellow-600';
    }
    if (current > max) return 'text-red-600';
    if (min && current < min) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getBgColor = () => {
    const textColor = getColor();
    return textColor.replace('text-', 'bg-');
  };

  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex justify-between text-xs">
        <span className={getColor()}>
          {current}/{max} characters
          {optimal && ` (optimal: ${optimal.min}-${optimal.max})`}
        </span>
      </div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all', getBgColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
