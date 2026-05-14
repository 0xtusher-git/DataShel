/* Shelby-inspired geometric logo mark — three interlocking arcs with diamond accents */
export default function DataShelLogo({ size = 32, textSize = '1.15rem' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer hexagon path */}
        <path
          d="M20 2 L35 11 L35 29 L20 38 L5 29 L5 11 Z"
          stroke="#FF69B4"
          strokeWidth="1.5"
          fill="none"
          opacity="0.35"
        />
        {/* Arc 1 — top arc */}
        <path
          d="M12 14 A10 10 0 0 1 28 14"
          stroke="#FF69B4"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arc 2 — bottom-left arc */}
        <path
          d="M11 15 A10 10 0 0 0 20 29"
          stroke="#f472b6"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arc 3 — bottom-right arc */}
        <path
          d="M29 15 A10 10 0 0 1 20 29"
          stroke="#f9a8d4"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Center diamond */}
        <rect x="18" y="18" width="4" height="4" transform="rotate(45 20 20)" fill="#FF69B4" />
        {/* Top diamond accent */}
        <rect x="19" y="10" width="2" height="2" transform="rotate(45 20 11)" fill="#FF69B4" opacity="0.8" />
        {/* Bottom-left diamond */}
        <rect x="13" y="26" width="2" height="2" transform="rotate(45 14 27)" fill="#f472b6" opacity="0.8" />
        {/* Bottom-right diamond */}
        <rect x="25" y="26" width="2" height="2" transform="rotate(45 26 27)" fill="#f9a8d4" opacity="0.8" />
      </svg>
      <span style={{
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        fontWeight: 700,
        fontSize: textSize,
        color: '#ffffff',
        letterSpacing: '-0.01em',
      }}>
        Data<span style={{ color: '#FF69B4' }}>Shel</span>
      </span>
    </div>
  );
}
