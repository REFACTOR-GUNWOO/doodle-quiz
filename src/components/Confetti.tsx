import React, { useMemo } from 'react';

const COLORS = ['#5B8EFF', '#FFE566', '#FF7070', '#5CBF7A', '#FF9FD0', '#A78BFA'];
const SHAPES = ['square', 'circle', 'rect'] as const;

const PIECES = 36;

export function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: PIECES }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      left: Math.round((i / PIECES) * 100 + (i % 7) - 3),
      delay: (i * 0.08) % 1.4,
      duration: 1.6 + (i % 5) * 0.2,
      size: 6 + (i % 4) * 2,
      swayDelay: (i * 0.13) % 1.2,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: -20,
            left: `${p.left}%`,
            width: p.shape === 'rect' ? p.size * 2 : p.size,
            height: p.size,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? 2 : 1,
            background: p.color,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards, confetti-sway ${p.duration * 0.6}s ${p.swayDelay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
