import { COLORS } from '../theme';
import { PrimaryButton } from '../components/UI';

type Props = {
  remaining: number;
  onUse: () => void;
  onClose: () => void;
};

export function HintModal({ remaining, onUse, onClose }: Props) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 22, zIndex: 50,
    }}>
      <div style={{
        background: '#fff', borderRadius: 22,
        padding: '22px 22px 24px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            💡 힌트를 사용할까요?
          </div>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20, color: COLORS.inkMuted }}
          >
            ✕
          </button>
        </div>

        <div style={{
          background: COLORS.yellowSoft, padding: '12px 14px',
          borderRadius: 10, fontSize: 14, color: COLORS.ink,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginBottom: 16, width: '100%', boxSizing: 'border-box',
        }}>
          💡 정답에서 랜덤 한 글자를 공개해요!
        </div>

        <div style={{ textAlign: 'center', fontSize: 14, color: COLORS.inkSoft, marginBottom: 12 }}>
          오늘 남은 힌트: <span style={{ color: COLORS.primary, fontWeight: 700 }}>{remaining}개</span>
        </div>

        <PrimaryButton onClick={onUse} disabled={remaining === 0}>힌트 사용하기</PrimaryButton>
      </div>
    </div>
  );
}
