"use client";

export default function Jar({
  canDraw,
  shaking,
  onClick,
}: {
  canDraw: boolean;
  shaking: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center ${
        canDraw ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Mở bình thư"
    >
      <svg
        width="180"
        height="200"
        viewBox="0 0 180 200"
        className={shaking ? "animate-jar-wiggle" : ""}
      >
        {/* lid */}
        <rect x="60" y="18" width="60" height="16" rx="6" fill="var(--accent)" />
        <rect x="68" y="10" width="44" height="12" rx="6" fill="var(--accent)" />

        {/* jar body */}
        <path
          d="M50 40 H130 L124 176 C124 188 112 196 90 196 C68 196 56 188 56 176 Z"
          fill="rgba(255,255,255,0.55)"
          stroke="var(--secondary)"
          strokeWidth="3"
        />

        {/* glass highlight */}
        <path
          d="M64 52 L58 168"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* letters inside */}
        <g>
          <rect x="70" y="140" width="26" height="18" rx="3" fill="var(--primary)" opacity="0.85" transform="rotate(-8 83 149)" />
          <rect x="92" y="150" width="24" height="17" rx="3" fill="var(--secondary)" opacity="0.9" transform="rotate(10 104 158)" />
          <rect x="66" y="120" width="22" height="16" rx="3" fill="var(--accent)" opacity="0.9" transform="rotate(6 77 128)" />
          <rect x="90" y="118" width="24" height="17" rx="3" fill="var(--primary)" opacity="0.7" transform="rotate(-12 102 126)" />
        </g>

        {/* sparkle when ready */}
        {canDraw && (
          <text x="140" y="60" fontSize="20" className="animate-pulse">
            ✨
          </text>
        )}
      </svg>

      <span
        className={`mt-3 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
          canDraw
            ? "bg-primary text-white shadow-sm shadow-primary/30 group-hover:bg-primary-dark"
            : "bg-border text-muted"
        }`}
      >
        {canDraw ? "Bốc một lá thư" : "Chưa đến lượt bạn"}
      </span>
    </button>
  );
}
