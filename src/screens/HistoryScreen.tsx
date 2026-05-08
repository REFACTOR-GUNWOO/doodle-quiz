import { COLORS } from '../theme';
import { useStore } from '../store';

type Props = {
  onBack: () => void;
};

export function HistoryScreen({ onBack }: Props) {
  const { streak, totalSolved, history, solvedToday, currentDate } = useStore();

  const recent7 = (() => {
    const result: { d: string; n: number; today: boolean }[] = [];
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const isToday = i === 0;
      let n: number;
      if (isToday) {
        n = currentDate === todayKey ? solvedToday.length : 0;
      } else {
        n = history.find((h) => h.date === key)?.solved ?? 0;
      }
      const label = isToday ? '오늘' : `${d.getMonth() + 1}/${d.getDate()}`;
      result.push({ d: label, n, today: isToday });
    }
    return result;
  })();

  const max = 5;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: COLORS.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 4px', height: 52 }}>
        <button
          onClick={onBack}
          style={{ width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M14 5 L 7 11 L 14 17" stroke={COLORS.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink }}>기록</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 32px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <StatCard emoji="🔥" label="연속 일수" value={`${streak}일`} />
          <StatCard emoji="📚" label="총 맞힌 문제" value={`${totalSolved}개`} />
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>최근 7일</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 16px 14px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, gap: 6 }}>
            {recent7.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                {d.n > 0 && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: d.today ? COLORS.primary : COLORS.inkSoft }}>
                    {d.n}
                  </div>
                )}
                <div style={{
                  width: '100%',
                  height: d.n > 0 ? `${(d.n / max) * 80}%` : 4,
                  background: d.today ? COLORS.primary : d.n > 0 ? '#BBBBBB' : COLORS.border,
                  borderRadius: '4px 4px 0 0',
                }} />
                <div style={{ fontSize: 10, color: d.today ? COLORS.primary : COLORS.inkSoft, fontWeight: d.today ? 700 : 400 }}>
                  {d.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div style={{
      flex: 1, background: '#fff', borderRadius: 16,
      border: `1px solid ${COLORS.border}`,
      padding: '16px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <span style={{ fontSize: 12, color: COLORS.inkSoft, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.ink }}>{value}</div>
    </div>
  );
}
