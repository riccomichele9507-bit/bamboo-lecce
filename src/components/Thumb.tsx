import { useState } from 'react';
import { COLORS } from '../config/theme';

interface ThumbProps {
  src: string;
  fallback: string;
  emoji: string;
  size?: number;
  radius?: number;
}

// Mostra la foto reale se esiste, altrimenti un placeholder a gradiente + emoji.
export default function Thumb({ src, fallback, emoji, size = 64, radius = 14 }: ThumbProps) {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: radius,
          background: fallback,
          border: `1px solid ${COLORS.border}`,
          display: 'grid',
          placeItems: 'center',
          fontSize: size * 0.42,
        }}
      >
        <span>{emoji}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setErr(true)}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        objectFit: 'cover',
        border: `1px solid ${COLORS.border}`,
        display: 'block',
      }}
    />
  );
}
