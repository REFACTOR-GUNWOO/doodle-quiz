import { COLORS } from '../theme';
import { CardFrame, PrimaryButton } from '../components/UI';
import { Confetti } from '../components/Confetti';

type Props = {
  qIdx: number;
  total: number;
  word: string;
  meaning: string;
  onNext: () => void;
};

export function CorrectScreen({ qIdx, total, word, meaning, onNext }: Props) {
  return (
    <div style={{ padding: '20px 22px 24px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'relative' }}>
      <Confetti />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ textAlign: 'center', fontSize: 48, fontWeight: 800, color: COLORS.ink, marginTop: 60, fontFamily: "'배달의민족 주아', system-ui" }}>
          정답!
        </div>

        <CardFrame style={{ padding: '22px 16px', marginTop: 18, textAlign: 'center' }}>
          <div style={{ fontFamily: "'배달의민족 주아', system-ui", fontSize: 38, fontWeight: 700, color: COLORS.green, letterSpacing: '0.02em' }}>
            {word}
          </div>
          <div style={{ fontSize: 16, color: COLORS.inkSoft, marginTop: 4 }}>{meaning}</div>
        </CardFrame>

        <div style={{ marginTop: 'auto' }}>
          <PrimaryButton onClick={onNext}>
            {qIdx + 1 < total ? `다음 문제 (${qIdx + 2} / ${total})` : '결과 보기'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
