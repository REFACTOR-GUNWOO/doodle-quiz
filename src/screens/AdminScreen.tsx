import React, { useEffect, useState } from 'react';
import { COLORS } from '../theme';
import { CardFrame, PrimaryButton, SecondaryButton } from '../components/UI';
import {
  fetchQuizzesForDate,
  upsertQuizRow,
  deleteQuizRow,
  uploadDoodle,
  isAdminEnabled,
  type AdminQuizRow,
} from '../api/admin';

function todayKST(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

type RowDraft = {
  position: number;
  word: string;
  meaning: string;
  existingUrl: string | null;
  file: File | null;
  localPreview: string | null;
  saving: boolean;
  status: string | null;
  error: string | null;
};

function emptyRow(position: number): RowDraft {
  return {
    position,
    word: '',
    meaning: '',
    existingUrl: null,
    file: null,
    localPreview: null,
    saving: false,
    status: null,
    error: null,
  };
}

export function AdminScreen() {
  const enabled = isAdminEnabled();
  const [date, setDate] = useState<string>(todayKST());
  const [rows, setRows] = useState<RowDraft[]>(() =>
    [1, 2, 3, 4, 5].map((p) => emptyRow(p))
  );
  const [loading, setLoading] = useState(false);
  const [globalMsg, setGlobalMsg] = useState<string | null>(null);

  const load = async (d: string) => {
    if (!enabled) return;
    setLoading(true);
    setGlobalMsg(null);
    try {
      const data = await fetchQuizzesForDate(d);
      const next: RowDraft[] = [1, 2, 3, 4, 5].map((p) => {
        const existing = data.find((r) => r.position === p);
        return {
          position: p,
          word: existing?.word ?? '',
          meaning: existing?.meaning ?? '',
          existingUrl: existing?.doodle_png ?? null,
          file: null,
          localPreview: null,
          saving: false,
          status: null,
          error: null,
        };
      });
      setRows(next);
      const filled = data.length;
      setGlobalMsg(`불러옴: ${filled}/5 문항`);
    } catch (e) {
      setGlobalMsg(`로드 실패: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) void load(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      rows.forEach((r) => {
        if (r.localPreview) URL.revokeObjectURL(r.localPreview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRow = (idx: number, patch: Partial<RowDraft>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const onPickFile = (idx: number, file: File | null) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        if (r.localPreview) URL.revokeObjectURL(r.localPreview);
        return {
          ...r,
          file,
          localPreview: file ? URL.createObjectURL(file) : null,
          status: null,
          error: null,
        };
      })
    );
  };

  const saveRow = async (idx: number) => {
    const r = rows[idx];
    if (!r.word.trim() || !r.meaning.trim()) {
      updateRow(idx, { error: '단어와 뜻을 입력하세요.' });
      return;
    }
    if (!r.existingUrl && !r.file) {
      updateRow(idx, { error: 'PNG 이미지를 선택하세요.' });
      return;
    }
    updateRow(idx, { saving: true, error: null, status: '저장 중...' });
    try {
      let url = r.existingUrl;
      if (r.file) {
        updateRow(idx, { status: '업로드 중...' });
        url = await uploadDoodle(date, r.position, r.file);
      }
      await upsertQuizRow({
        quiz_date: date,
        position: r.position,
        word: r.word.trim().toUpperCase(),
        meaning: r.meaning.trim(),
        doodle_png: url,
      });
      if (r.localPreview) URL.revokeObjectURL(r.localPreview);
      updateRow(idx, {
        saving: false,
        status: '저장 완료',
        existingUrl: url,
        file: null,
        localPreview: null,
      });
    } catch (e) {
      updateRow(idx, {
        saving: false,
        status: null,
        error: (e as Error).message,
      });
    }
  };

  const deleteRow = async (idx: number) => {
    const r = rows[idx];
    if (!confirm(`Position ${r.position} 삭제할까요?`)) return;
    updateRow(idx, { saving: true, error: null, status: '삭제 중...' });
    try {
      await deleteQuizRow(date, r.position);
      if (r.localPreview) URL.revokeObjectURL(r.localPreview);
      setRows((prev) =>
        prev.map((x, i) => (i === idx ? emptyRow(r.position) : x))
      );
    } catch (e) {
      updateRow(idx, {
        saving: false,
        status: null,
        error: (e as Error).message,
      });
    }
  };

  const saveAll = async () => {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const hasContent = r.word.trim() || r.meaning.trim() || r.file || r.existingUrl;
      if (!hasContent) continue;
      await saveRow(i);
    }
  };

  if (!enabled) {
    return (
      <div style={{ padding: 24, fontFamily: 'inherit', color: COLORS.ink }}>
        <h2 style={{ marginTop: 0 }}>Admin 비활성</h2>
        <p style={{ color: COLORS.inkSoft, lineHeight: 1.6 }}>
          이 페이지는 dev 환경에서만 작동합니다.
          <br />
          <code>.env.local</code>에 <code>VITE_SUPABASE_SERVICE_ROLE_KEY</code>를
          설정하고 <code>npm run dev</code>로 실행하세요.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: COLORS.bg,
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          background: '#fff',
          borderBottom: `1px solid ${COLORS.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 700 }}>
            Admin <span style={{ color: COLORS.red, fontSize: 12 }}>· DEV ONLY</span>
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
              window.location.reload();
            }}
            style={{ color: COLORS.primary, fontSize: 13, textDecoration: 'none' }}
          >
            앱으로 ↩
          </a>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '8px 10px',
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'inherit',
              flex: 1,
            }}
          />
          <SecondaryButton
            onClick={() => load(date)}
            style={{ flex: 'none', padding: '10px 16px' }}
          >
            {loading ? '...' : '불러오기'}
          </SecondaryButton>
        </div>
        {globalMsg && (
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: COLORS.inkSoft,
            }}
          >
            {globalMsg}
          </div>
        )}
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map((r, idx) => {
          const previewUrl = r.localPreview ?? r.existingUrl;
          return (
            <CardFrame key={r.position} style={{ padding: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: COLORS.primary,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {r.position}
                </div>
                <div style={{ fontSize: 11, color: COLORS.inkMuted }}>
                  {r.existingUrl ? '✓ 저장됨' : '신규'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 10,
                    background: '#F3F4F6',
                    border: `1px dashed ${COLORS.border}`,
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 11, color: COLORS.inkMuted }}>
                      no image
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input
                    placeholder="단어 (영문)"
                    value={r.word}
                    onChange={(e) => updateRow(idx, { word: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    placeholder="뜻 (한글)"
                    value={r.meaning}
                    onChange={(e) => updateRow(idx, { meaning: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => onPickFile(idx, e.target.files?.[0] ?? null)}
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>

              {(r.status || r.error) && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: r.error ? COLORS.red : COLORS.inkSoft,
                  }}
                >
                  {r.error ?? r.status}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => saveRow(idx)}
                  disabled={r.saving}
                  style={smallBtn(COLORS.primary, '#fff', r.saving)}
                >
                  {r.saving ? '...' : '저장'}
                </button>
                <button
                  onClick={() => deleteRow(idx)}
                  disabled={r.saving || !r.existingUrl}
                  style={smallBtn('#fff', COLORS.red, r.saving || !r.existingUrl, COLORS.red)}
                >
                  삭제
                </button>
              </div>
            </CardFrame>
          );
        })}

        <PrimaryButton onClick={saveAll}>모두 저장</PrimaryButton>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
};

function smallBtn(
  bg: string,
  color: string,
  disabled: boolean,
  border?: string
): React.CSSProperties {
  return {
    flex: 1,
    padding: '9px 0',
    background: bg,
    color,
    border: border ? `1.5px solid ${border}` : 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'inherit',
  };
}
