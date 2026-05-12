import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Storage } from '@apps-in-toss/web-framework';

const storage = import.meta.env.PROD
  ? createJSONStorage(() => Storage)
  : undefined;

function todayKST(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function yesterdayKST(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000 - 86400000).toISOString().slice(0, 10);
}

export type Quiz = {
  id: string;
  position: number;
  word: string;
  meaning: string;
  doodle_png: string | null;
};

type LocalState = {
  userId: string;
  currentDate: string;
  currentIdx: number;
  hintsRemaining: number;
  hintsUsedToday: number;
  hintMasks: Record<number, (string | null)[]>;
  solvedToday: number[];
  failedToday: number[];

  streak: number;
  lastCompletedDate: string | null;
  totalSolved: number;
  totalAttempts: number;
  history: { date: string; solved: number }[];

  sound: boolean;

  cachedDate: string | null;
  cachedQuizzes: Quiz[];
};

type Actions = {
  tickDate: () => void;
  submitAnswer: (word: string, isCorrect: boolean) => void;
  useHint: (qIdx: number, word: string) => void;
  addHint: () => void;
  setSolvedToday: (idx: number) => void;
  setFailedToday: (idx: number) => void;
  setCurrentIdx: (idx: number) => void;
  setSound: (on: boolean) => void;
  setCachedQuizzes: (quizzes: Quiz[]) => void;
  resetHints: () => void;
};

export const useStore = create<LocalState & Actions>()(
  persist(
    (set, get) => ({
      userId: crypto.randomUUID(),
      currentDate: todayKST(),
      currentIdx: 0,
      hintsRemaining: 1,
      hintsUsedToday: 0,
      hintMasks: {},
      solvedToday: [],
      failedToday: [],

      streak: 0,
      lastCompletedDate: null,
      totalSolved: 0,
      totalAttempts: 0,
      history: [],

      sound: true,

      cachedDate: null,
      cachedQuizzes: [],

      tickDate() {
        const state = get();
        const t = todayKST();
        if (state.currentDate === t) return;

        const prevSolved = state.solvedToday.length;
        const prevDate = state.currentDate;

        let newStreak = state.streak;
        if (prevSolved === 5 && prevDate === yesterdayKST()) {
          newStreak = state.streak + 1;
        } else if (prevDate !== yesterdayKST()) {
          newStreak = 0;
        }

        const newHistory = [
          ...state.history.slice(-29),
          { date: prevDate, solved: prevSolved },
        ];

        set({
          currentDate: t,
          currentIdx: 0,
          hintsRemaining: 1,
          hintsUsedToday: 0,
          hintMasks: {},
          solvedToday: [],
          failedToday: [],
          streak: newStreak,
          history: newHistory,
        });
      },

      submitAnswer(_word, isCorrect) {
        if (!isCorrect) {
          set((s) => ({ totalAttempts: s.totalAttempts + 1 }));
        }
      },

      useHint(qIdx, word) {
        const state = get();
        if (state.hintsRemaining <= 0) return;
        const mask: (string | null)[] = state.hintMasks[qIdx] ?? word.split('').map(() => null);
        const hidden = mask.map((m, i) => (m === null ? i : -1)).filter((i) => i >= 0);
        if (hidden.length === 0) return;
        const pick = hidden[Math.floor(Math.random() * hidden.length)];
        mask[pick] = word[pick];
        set((s) => ({
          hintsRemaining: s.hintsRemaining - 1,
          hintsUsedToday: s.hintsUsedToday + 1,
          hintMasks: { ...s.hintMasks, [qIdx]: [...mask] },
        }));
      },

      addHint() {
        set((s) => ({ hintsRemaining: s.hintsRemaining + 1 }));
      },

      setSolvedToday(idx) {
        set((s) => ({
          solvedToday: s.solvedToday.includes(idx) ? s.solvedToday : [...s.solvedToday, idx],
          totalSolved: s.totalSolved + 1,
          totalAttempts: s.totalAttempts + 1,
        }));
      },

      setFailedToday(idx) {
        set((s) => ({
          failedToday: s.failedToday.includes(idx) ? s.failedToday : [...s.failedToday, idx],
        }));
      },

      setCurrentIdx(idx) {
        set({ currentIdx: idx });
      },

      setSound(on) {
        set({ sound: on });
      },

      setCachedQuizzes(quizzes) {
        set({ cachedDate: todayKST(), cachedQuizzes: quizzes });
      },

      resetHints() {
        set({ hintsRemaining: 3 });
      },
    }),
    {
      name: 'doodle-quiz-v1',
      ...(storage ? { storage } : {}),
    }
  )
);
