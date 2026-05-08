import { COLORS } from '../theme';

export function DoodleDinosaur({ size = 220, withScene = true }: { size?: number; withScene?: boolean }) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {withScene && (
        <g>
          <circle cx="232" cy="38" r="14" stroke="#F5B82E" strokeWidth="2.5" fill="none" />
          {angles.map((a, i) => {
            const r1 = 20, r2 = 28;
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={232 + Math.cos(rad) * r1} y1={38 + Math.sin(rad) * r1}
                x2={232 + Math.cos(rad) * r2} y2={38 + Math.sin(rad) * r2}
                stroke="#F5B82E" strokeWidth="2.5" strokeLinecap="round"
              />
            );
          })}
        </g>
      )}
      <path
        d="M40 175 C 30 160, 38 140, 55 138 C 60 110, 80 95, 105 100 C 115 75, 140 60, 165 70 C 195 78, 205 105, 195 130 C 215 132, 225 148, 220 165 C 215 180, 195 182, 180 175 L 175 195 L 165 195 L 162 178 C 145 180, 125 178, 110 172 L 105 195 L 95 195 L 92 170 C 75 168, 60 178, 50 185 Z"
        stroke="#3FA34D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <circle cx="155" cy="82" r="3" fill="#3FA34D" />
      <path d="M158 92 Q 165 96, 172 92" stroke="#3FA34D" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d="M120 145 Q 140 152, 165 145 M115 158 Q 140 165, 170 158"
        stroke="#3FA34D" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"
      />
      {withScene && (
        <path
          d="M20 200 Q 60 205, 110 200 T 200 200 T 270 200"
          stroke="#B5651D" strokeWidth="2" strokeLinecap="round" fill="none"
        />
      )}
    </svg>
  );
}

export function DoodleRocket({ size = 220, withScene = true }: { size?: number; withScene?: boolean }) {
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 260 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      {withScene && (
        <g>
          <path d="M60 60 L64 72 L76 72 L66 80 L70 92 L60 84 L50 92 L54 80 L44 72 L56 72 Z" stroke="#F5B82E" strokeWidth="1.8" fill="#FEF3C7" strokeLinejoin="round" />
          <path d="M210 130 L213 138 L221 138 L215 144 L217 152 L210 147 L203 152 L205 144 L199 138 L207 138 Z" stroke="#F5B82E" strokeWidth="1.8" fill="#FEF3C7" strokeLinejoin="round" />
          <path d="M50 175 L53 183 L61 183 L55 189 L57 197 L50 192 L43 197 L45 189 L39 183 L47 183 Z" stroke="#F5B82E" strokeWidth="1.8" fill="#FEF3C7" strokeLinejoin="round" />
          <circle cx="215" cy="65" r="14" stroke="#2C5FD9" strokeWidth="2.2" fill="none" />
          <ellipse cx="215" cy="65" rx="22" ry="6" stroke="#2C5FD9" strokeWidth="2" fill="none" transform="rotate(-15 215 65)" />
        </g>
      )}
      <path d="M130 30 C 110 60, 105 100, 105 145 L 105 175 L 155 175 L 155 145 C 155 100, 150 60, 130 30 Z" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round" fill="#fff" />
      <path d="M115 70 L 145 70 C 144 55, 138 40, 130 32 C 122 40, 116 55, 115 70 Z" stroke="#E53935" strokeWidth="2.5" fill="#E53935" opacity="0.85" strokeLinejoin="round" />
      <circle cx="130" cy="105" r="14" stroke="#1F1F1F" strokeWidth="2.5" fill="#3D8BFF" />
      <circle cx="130" cy="105" r="9" stroke="#1F1F1F" strokeWidth="1.5" fill="#7FB5FF" />
      <path d="M125 100 L 128 103" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M105 145 L 85 175 L 105 170 Z" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round" fill="#E53935" />
      <path d="M155 145 L 175 175 L 155 170 Z" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round" fill="#E53935" />
      <path
        d="M112 175 L 108 210 L 118 195 L 122 220 L 128 200 L 132 218 L 138 200 L 142 220 L 148 195 L 152 210 L 148 175"
        stroke="#FF6B1A" strokeWidth="2.2" fill="#FFA94D" strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleApple({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" fill="none">
      <path d="M110 60 C 80 55, 55 75, 55 110 C 55 150, 80 185, 110 185 C 140 185, 165 150, 165 110 C 165 75, 140 55, 110 60 Z" stroke="#E53935" strokeWidth="2.8" fill="#FF6B6B" strokeLinejoin="round" />
      <path d="M70 90 Q 90 80, 110 85 M 75 110 Q 100 105, 125 112" stroke="#B71C1C" strokeWidth="1.2" opacity="0.6" />
      <path d="M110 60 C 112 45, 120 38, 132 35" stroke="#5D3A1A" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M118 50 Q 135 35, 155 42 Q 145 55, 125 55 Z" stroke="#3FA34D" strokeWidth="2.2" fill="#7CC47F" strokeLinejoin="round" />
      <path d="M88 90 Q 95 85, 100 95" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}

export function DoodleHouse({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 240 200" fill="none">
      <path d="M30 100 L 120 35 L 210 100 Z" stroke="#1F1F1F" strokeWidth="2.5" fill="#E53935" strokeLinejoin="round" />
      <rect x="50" y="100" width="140" height="80" stroke="#1F1F1F" strokeWidth="2.5" fill="#FEF3C7" />
      <rect x="100" y="130" width="40" height="50" stroke="#1F1F1F" strokeWidth="2.2" fill="#5D3A1A" />
      <circle cx="132" cy="155" r="2" fill="#F5B82E" />
      <rect x="60" y="115" width="28" height="28" stroke="#1F1F1F" strokeWidth="2" fill="#7FB5FF" />
      <line x1="74" y1="115" x2="74" y2="143" stroke="#1F1F1F" strokeWidth="1.5" />
      <line x1="60" y1="129" x2="88" y2="129" stroke="#1F1F1F" strokeWidth="1.5" />
      <rect x="152" y="115" width="28" height="28" stroke="#1F1F1F" strokeWidth="2" fill="#7FB5FF" />
      <line x1="166" y1="115" x2="166" y2="143" stroke="#1F1F1F" strokeWidth="1.5" />
      <line x1="152" y1="129" x2="180" y2="129" stroke="#1F1F1F" strokeWidth="1.5" />
      <rect x="160" y="55" width="18" height="28" stroke="#1F1F1F" strokeWidth="2" fill="#B5651D" />
      <path d="M165 50 Q 168 40, 175 45 Q 180 35, 185 45" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M10 185 Q 60 188, 120 185 T 230 185" stroke="#3FA34D" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function DoodleCat({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 220 210" fill="none">
      <ellipse cx="110" cy="155" rx="55" ry="35" stroke="#1F1F1F" strokeWidth="2.5" fill="#F5B82E" />
      <circle cx="110" cy="100" r="45" stroke="#1F1F1F" strokeWidth="2.5" fill="#F5B82E" />
      <path d="M75 70 L 70 40 L 95 60 Z" stroke="#1F1F1F" strokeWidth="2.5" fill="#F5B82E" strokeLinejoin="round" />
      <path d="M145 70 L 150 40 L 125 60 Z" stroke="#1F1F1F" strokeWidth="2.5" fill="#F5B82E" strokeLinejoin="round" />
      <path d="M78 62 L 82 50 L 90 58 Z" fill="#FFB6C1" />
      <path d="M142 62 L 138 50 L 130 58 Z" fill="#FFB6C1" />
      <ellipse cx="92" cy="98" rx="4" ry="6" fill="#1F1F1F" />
      <ellipse cx="128" cy="98" rx="4" ry="6" fill="#1F1F1F" />
      <path d="M106 112 L 110 117 L 114 112 Z" fill="#FFB6C1" />
      <path d="M110 117 L 110 122 M 110 122 Q 105 127, 100 124 M 110 122 Q 115 127, 120 124" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M75 115 L 95 118 M 75 122 L 95 122 M 145 115 L 125 118 M 145 122 L 125 122" stroke="#1F1F1F" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M160 150 Q 190 130, 195 100 Q 198 80, 185 75" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DoodleSun({ size = 80 }: { size?: number }) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="14" stroke="#F5B82E" strokeWidth="2.5" fill="#FEF3C7" />
      {angles.map((a, i) => {
        const r1 = 20, r2 = 30;
        const rad = (a * Math.PI) / 180;
        return (
          <line key={i}
            x1={40 + Math.cos(rad) * r1} y1={40 + Math.sin(rad) * r1}
            x2={40 + Math.cos(rad) * r2} y2={40 + Math.sin(rad) * r2}
            stroke="#F5B82E" strokeWidth="2.5" strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function SmilingFace() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="48" stroke={COLORS.green} strokeWidth="3" fill="none" />
      <circle cx="46" cy="55" r="3" fill={COLORS.green} />
      <circle cx="74" cy="55" r="3" fill={COLORS.green} />
      <path d="M44 70 Q 60 84, 76 70" stroke={COLORS.green} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Trophy() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <path d="M30 20 L 70 20 L 68 50 C 68 60, 60 66, 50 66 C 40 66, 32 60, 32 50 Z" stroke={COLORS.ink} strokeWidth="2.5" fill={COLORS.yellow} strokeLinejoin="round" />
      <path d="M30 28 L 18 28 C 16 28, 14 30, 16 36 C 18 42, 24 44, 30 42" stroke={COLORS.ink} strokeWidth="2.5" fill="none" />
      <path d="M70 28 L 82 28 C 84 28, 86 30, 84 36 C 82 42, 76 44, 70 42" stroke={COLORS.ink} strokeWidth="2.5" fill="none" />
      <rect x="42" y="66" width="16" height="10" stroke={COLORS.ink} strokeWidth="2.5" fill={COLORS.yellow} />
      <rect x="32" y="76" width="36" height="6" rx="1" stroke={COLORS.ink} strokeWidth="2.5" fill={COLORS.yellow} />
      <path d="M44 35 L 48 42 L 56 32" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DoodleByWord({ word, size = 220 }: { word: string; size?: number }) {
  const map: Record<string, React.FC<{ size?: number }>> = {
    DINOSAUR: (p) => <DoodleDinosaur size={p.size} withScene={false} />,
    ROCKET: (p) => <DoodleRocket size={p.size} withScene={false} />,
    APPLE: DoodleApple,
    HOUSE: DoodleHouse,
    CAT: DoodleCat,
  };
  const Component = map[word.toUpperCase()];
  if (!Component) return null;
  return <Component size={size} />;
}
