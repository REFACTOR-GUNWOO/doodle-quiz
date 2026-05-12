import { COLORS } from '../theme';
import { PrimaryButton } from '../components/UI';

type Props = {
  remaining: number;
  onUse: () => void;
  onClose: () => void;
  onWatchAd?: () => void;
  adState?: 'loading' | 'ready' | 'failed';
};

export function HintModal({ remaining, onUse, onClose, onWatchAd, adState }: Props) {
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

        {remaining === 0 && onWatchAd ? (
          <>
            <div style={{ textAlign: 'center', fontSize: 13, color: COLORS.inkMuted, marginBottom: 10 }}>
              {adState === 'failed'
                ? '광고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
                : '힌트를 모두 사용했어요. 광고를 보고 힌트 3개를 받아요!'}
            </div>
            {adState !== 'failed' && (
              <PrimaryButton onClick={onWatchAd} disabled={adState !== 'ready'}>
                {adState === 'ready' ? '📺 광고 보고 힌트 3개 받기' : '광고 불러오는 중...'}
              </PrimaryButton>
            )}
          </>
        ) : (
          <PrimaryButton onClick={onUse} disabled={remaining === 0}>힌트 사용하기</PrimaryButton>
        )}
      </div>
    </div>
  );
}
