import React from 'react';
import { COLORS } from '../theme';

export function CardFrame({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1.5px solid ${COLORS.border}`,
      borderRadius: 18,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function HintBadge({ count, dim = false, onClick }: { count: number; dim?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: COLORS.yellow,
        color: dim ? COLORS.inkMuted : COLORS.ink,
        padding: '7px 12px', borderRadius: 999,
        fontSize: 14, fontWeight: 700,
        cursor: onClick ? 'pointer' : 'default',
        opacity: dim ? 0.5 : 1,
      }}
    >
      <span style={{ fontSize: 15 }}>💡</span>
      <span>힌트 {count}</span>
    </div>
  );
}

export function PrimaryButton({
  children, onClick, disabled, style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: '15px 0',
        background: disabled ? COLORS.inkMuted : COLORS.primary,
        color: '#fff', border: 'none', borderRadius: 12,
        fontSize: 17, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children, onClick, style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '14px 0',
        background: '#fff', color: COLORS.ink,
        border: `1.5px solid ${COLORS.border}`, borderRadius: 12,
        fontSize: 15, fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function NavBar({
  title, onBack, hintCount, hintDim, onHint, hideHint,
}: {
  title: string;
  onBack?: () => void;
  hintCount: number;
  hintDim?: boolean;
  onHint: () => void;
  hideHint?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px 12px', height: 44, position: 'relative',
    }}>
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            width: 36, height: 36, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5 L 7 11 L 14 17" stroke={COLORS.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <div style={{ width: 36, flexShrink: 0 }} />
      )}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
      }}>
        {/^\d+ \/ \d+$/.test(title) ? (() => {
          const [cur, , tot] = title.split(' ');
          return (
            <span>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink }}>{cur}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.inkMuted }}> / {tot}</span>
            </span>
          );
        })() : (
          <span style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{title}</span>
        )}
      </div>
      {!hideHint && <HintBadge count={hintCount} dim={hintDim} onClick={onHint} />}
      {hideHint && <div style={{ width: 36, flexShrink: 0 }} />}
    </div>
  );
}


export function StatRow({ label, value, last }: { label: React.ReactNode; value: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 0', borderBottom: last ? 'none' : `1px solid ${COLORS.border}`,
      fontSize: 15, color: COLORS.ink,
    }}>
      <span>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 48, height: 28, borderRadius: 999,
        background: on ? COLORS.primary : COLORS.borderStrong,
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? 22 : 2,
        width: 24, height: 24, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

export function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3 L 9 7 L 5 11" stroke={COLORS.inkMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


