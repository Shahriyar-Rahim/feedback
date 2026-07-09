import { useState } from "react";

// Interactive 1-5 star rating input with hover preview.
const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold-500 rounded transition-transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-9 h-9 transition-colors duration-150 ${
                filled ? "fill-amber-400 stroke-marigold-600" : "border-b stroke-plum-400"
              }`}
              strokeWidth="1.5"
            >
              <path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.8-6.1-3.6-6.1 3.6 1.5-6.8-5.1-4.6 6.8-.7L12 2.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
