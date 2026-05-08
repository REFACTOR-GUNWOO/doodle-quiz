import noQuizImg from '../assets/no-quiz.png';
import { COLORS } from '../theme';
import { CardFrame, PrimaryButton, SecondaryButton } from '../components/UI';
import { Storage } from '@apps-in-toss/web-framework';
import type { Quiz } from '../store';

type Props = {
  progress: number;
  previewQuiz: Quiz | null;
  hasQuizzes: boolean;
  allDone: boolean;
  onStart: () => void;
  onHistory: () => void;
};

async function devReset() {
  if (!confirm('로컬 진행 상황을 모두 초기화할까요?\n(연속 일수 / 풀이 기록 / 캐시된 문제 / 힌트)')) return;
  try {
    if (import.meta.env.PROD) {
      await Storage.removeItem('doodle-quiz-v1');
    } else {
      localStorage.removeItem('doodle-quiz-v1');
    }
  } catch {
    // ignore storage errors
  }
  window.location.reload();
}

export function HomeScreen({ progress, previewQuiz, hasQuizzes, allDone, onStart, onHistory }: Props) {
  const showCelebration = allDone || !previewQuiz;

  return (
    <div style={{
      padding: '12px 22px 24px',
      display: 'flex', flexDirection: 'column', gap: 18,
      height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <div style={{
          fontFamily: "'배달의민족 주아', system-ui",
          fontSize: 52, fontWeight: 700, color: COLORS.ink,
          letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'center', gap: 8,
          lineHeight: 1.15,
        }}>
          Doodle Quiz <span style={{ fontSize: 28 }}>✏️</span>
        </div>
        <div style={{ fontSize: 15, color: COLORS.inkSoft, marginTop: 10, marginBottom: 12 }}>그림 보고 영어 단어 맞추기!</div>
      </div>

      {!hasQuizzes ? (
        <CardFrame style={{ padding: '24px 18px', textAlign: 'center' }}>
          <img src={noQuizImg} alt="" style={{ width: 180, height: 180, objectFit: 'contain' }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink, marginTop: 12 }}>오늘의 퀴즈가 없어요</div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>내일 다시 확인해 주세요!</div>
        </CardFrame>
      ) : showCelebration ? (
        <CardFrame style={{ padding: '36px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink, marginTop: 12 }}>오늘 문제 완료!</div>
          <div style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 6 }}>내일 새로운 낙서가 기다리고 있어요</div>
        </CardFrame>
      ) : (
        <CardFrame style={{ padding: '16px 18px 16px', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
            background: COLORS.yellow, color: COLORS.ink,
            padding: '6px 18px', borderRadius: 999,
            fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            What is this?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 36, minHeight: 210 }}>
            {previewQuiz!.doodle_png && (
              <img
                src={previewQuiz!.doodle_png}
                alt=""
                style={{ width: 210, height: 210, objectFit: 'contain', imageRendering: 'pixelated' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                width: i < progress ? 20 : 8,
                height: 8,
                borderRadius: 999,
                background: i < progress ? COLORS.primary : COLORS.border,
                transition: 'width 0.2s, background 0.2s',
              }} />
            ))}
          </div>
        </CardFrame>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
        <PrimaryButton onClick={onStart} disabled={allDone || !hasQuizzes}>
          {!hasQuizzes ? '오늘 퀴즈 없음' : allDone ? '오늘 완료! 🎉' : progress === 0 ? '문제 풀기' : `이어서 풀기 (${progress}/5)`}
        </PrimaryButton>
        <SecondaryButton onClick={onHistory}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="10" width="3" height="6" fill={COLORS.ink} />
            <rect x="7.5" y="6" width="3" height="10" fill={COLORS.ink} />
            <rect x="13" y="2" width="3" height="14" fill={COLORS.ink} />
          </svg>
          기록
        </SecondaryButton>
        {import.meta.env.VITE_DEBUG === 'true' && (
          <button
            onClick={devReset}
            style={{
              marginTop: 4,
              padding: '8px 0',
              background: 'transparent',
              border: `1px dashed ${COLORS.red}`,
              borderRadius: 8,
              color: COLORS.red,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            🔧 Dev Reset (로컬 상태 초기화)
          </button>
        )}
      </div>
    </div>
  );
}
