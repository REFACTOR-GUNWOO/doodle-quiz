import { COLORS } from '../theme';
import { CardFrame, PrimaryButton, StatRow } from '../components/UI';
import { Trophy } from '../components/Doodles';
import { Confetti } from '../components/Confetti';

type Props = {
  correct: number;
  total: number;
  hintsUsed: number;
  hintsLeft: number;
  onAgain: () => void;
};

export function DoneScreen({ correct, total, hintsUsed, hintsLeft, onAgain }: Props) {
  return (
    <div style={{ padding: '20px 22px 32px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative' }}>
      <Confetti />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Trophy />
        </div>
        <div style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, color: COLORS.ink, marginTop: 8 }}>
          오늘의 문제 완료!
        </div>
        <div style={{ textAlign: 'center', fontSize: 14, color: COLORS.inkSoft, marginTop: 4 }}>
          {correct === 5 ? '5문제 모두 맞혔어요! 🎉' : `${correct}문제 맞혔어요!`}
        </div>

        <CardFrame style={{ padding: '6px 18px', marginTop: 22 }}>
          <StatRow label="맞힌 문제" value={`${correct} / ${total}`} />
          <StatRow label="사용한 힌트" value={hintsUsed} />
          <StatRow label="남은 힌트" value={<span>💡 {hintsLeft}</span>} last />
        </CardFrame>

        <div style={{ marginTop: 'auto' }}>
          <PrimaryButton onClick={onAgain}>홈으로</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
