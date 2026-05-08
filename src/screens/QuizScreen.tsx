import React, { useRef, useState, useEffect } from 'react';
import { COLORS } from '../theme';
import { CardFrame, NavBar, PrimaryButton } from '../components/UI';
import type { Quiz } from '../store';

type Props = {
  quiz: Quiz;
  qIdx: number;
  total: number;
  hints: number;
  hintMask: (string | null)[] | undefined;
  value: string;
  setValue: (v: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onHome: () => void;
  shake: boolean;
  attempts: number;
  maxAttempts: number;
};

function SlotInput({
  word, mask, value, setValue, onSubmit,
}: {
  word: string;
  mask: (string | null)[] | undefined;
  value: string;
  setValue: (v: string) => void;
  onSubmit: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const len = word.length;
  const safeMask: (string | null)[] = Array.from({ length: len }, (_, i) =>
    mask && mask[i] ? mask[i] : null
  );
  const blanks = safeMask.filter((c) => c === null).length;

  const slots: { revealed: boolean; isSpace: boolean; ch: string }[] = [];
  let typedIdx = 0;
  for (let i = 0; i < len; i++) {
    const isSpace = word[i] === ' ';
    if (safeMask[i]) {
      slots.push({ revealed: true, isSpace, ch: safeMask[i]! });
    } else {
      slots.push({ revealed: false, isSpace, ch: value[typedIdx] ?? '' });
      typedIdx++;
    }
  }

  return (
    <div
      style={{ position: 'relative', padding: '4px 0', cursor: 'text' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        {slots.map((s, i) =>
          s.isSpace ? (
            <div key={i} style={{ width: 16 }} />
          ) : (
            <div
              key={i}
              style={{
                width: 36,
                height: 44,
                border: `2px solid ${s.revealed ? COLORS.primary : s.ch ? COLORS.ink : COLORS.borderStrong}`,
                borderRadius: 8,
                background: s.revealed ? COLORS.yellowSoft : s.ch ? COLORS.bg : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 700,
                color: s.revealed ? COLORS.primary : COLORS.ink,
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {s.ch}
            </div>
          )
        )}
      </div>
      <input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) =>
          setValue(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, blanks))
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
        }}
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          border: 'none',
          background: 'transparent',
          fontFamily: 'inherit',
          padding: 0,
          caretColor: 'transparent',
          color: 'transparent',
        }}
      />
    </div>
  );
}

export function QuizScreen({ quiz, qIdx, total, hints, hintMask, value, setValue, onSubmit, onHint, onHome, shake, attempts, maxAttempts }: Props) {
  const [imageLoaded, setImageLoaded] = useState(!quiz.doodle_png);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    setImageLoaded(!quiz.doodle_png);
  }, [quiz.id]);

  const blanks = (() => {
    const len = quiz.word.length;
    let count = 0;
    for (let i = 0; i < len; i++) {
      if (quiz.word[i] === ' ') continue;
      if (!(hintMask && hintMask[i])) count++;
    }
    return count;
  })();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
        if (dx > 80 && dy < 60) onHome();
      }}
    >
      <NavBar
        title={`${qIdx + 1} / ${total}`}
        hintCount={hints}
        hintDim={hints === 0}
        onHint={onHint}
      />

      <div
        style={{
          padding: '4px 22px 24px',
          display: 'flex', flexDirection: 'column', gap: 14, flex: 1,
          animation: shake ? 'shake 0.4s' : 'none',
        }}
      >
        <CardFrame style={{ padding: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
            background: COLORS.yellow, color: COLORS.ink,
            padding: '6px 18px', borderRadius: 999,
            fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            What is this?
          </div>
          {quiz.doodle_png && (
            <>
              {!imageLoaded && (
                <div style={{ width: 210, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `3px solid ${COLORS.border}`,
                    borderTopColor: COLORS.primary,
                    animation: 'spin 0.8s linear infinite',
                  }} />
                </div>
              )}
              <img
                src={quiz.doodle_png}
                alt={quiz.meaning}
                onLoad={() => setImageLoaded(true)}
                style={{ width: 210, height: 210, objectFit: 'contain', imageRendering: 'pixelated', display: imageLoaded ? 'block' : 'none' }}
              />
            </>
          )}
        </CardFrame>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {Array.from({ length: maxAttempts }).map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i < attempts ? COLORS.red : COLORS.border,
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        <SlotInput
          word={quiz.word}
          mask={hintMask}
          value={value}
          setValue={setValue}
          onSubmit={onSubmit}
        />

        <PrimaryButton onClick={onSubmit} disabled={value.length < blanks}>제출</PrimaryButton>
      </div>
    </div>
  );
}
