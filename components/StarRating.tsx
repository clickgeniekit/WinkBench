'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showNumber?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${rating} out of ${maxStars} stars`}>
        {Array.from({ length: maxStars }).map((_, index) => {
          const starIndex = index + 1;
          const isFilled = currentVal >= starIndex;
          const isPartiallyFilled = !isFilled && currentVal > index && currentVal < starIndex;
          const fillPercentage = isPartiallyFilled ? Math.round((currentVal - index) * 100) : isFilled ? 100 : 0;

          if (interactive) {
            return (
              <button
                type="button"
                key={index}
                onClick={() => onChange && onChange(starIndex)}
                onMouseEnter={() => setHoverRating(starIndex)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-0.5 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded transition-transform hover:scale-110"
                aria-label={`${starIndex} star${starIndex > 1 ? 's' : ''}`}
              >
                <Star
                  className={`${sizeClasses[size]} ${
                    isFilled ? 'fill-amber-400 text-amber-500' : 'fill-slate-100 text-slate-300'
                  }`}
                />
              </button>
            );
          }

          return (
            <div key={index} className="relative inline-block">
              {/* Background empty star */}
              <Star className={`${sizeClasses[size]} text-slate-200 fill-slate-100`} />
              {/* Foreground filled overlay */}
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star className={`${sizeClasses[size]} text-amber-500 fill-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNumber && (
        <span className="ml-1 text-sm font-semibold text-slate-800">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
