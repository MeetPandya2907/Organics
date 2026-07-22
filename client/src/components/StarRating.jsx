import { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Interactive star-rating picker.
 * Props:
 *   value      – current rating (number 0-5)
 *   onChange   – (newRating: number) => void
 *   size       – icon size (default 28)
 *   readonly   – if true, just display stars without interaction
 */
const StarRating = ({ value = 0, onChange, size = 28, readonly = false }) => {
  const [hovered, setHovered] = useState(0);

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center gap-1.5"
        onMouseLeave={() => !readonly && setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const active = (hovered || value) >= star;
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => !readonly && setHovered(star)}
              className={`transition-transform duration-150 ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
              }`}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                className={`transition-colors duration-150 ${
                  active
                    ? 'text-fittree-accent fill-fittree-accent'
                    : 'text-fittree-border fill-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
      {!readonly && (hovered || value) > 0 && (
        <p className="text-[12px] font-bold text-fittree-primary uppercase tracking-wider">
          {labels[hovered || value]}
        </p>
      )}
    </div>
  );
};

export default StarRating;
