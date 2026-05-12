import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { getAnonymousKey, loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';
import { useStore } from './store';
import { fetchTodayQuizzes } from './api/quiz';
import { saveQuizResult } from './api/results';
import { HomeScreen } from './screens/HomeScreen';
import { QuizScreen } from './screens/QuizScreen';
import { HintModal } from './screens/HintModal';
import { CorrectScreen } from './screens/CorrectScreen';
import { FailedScreen } from './screens/FailedScreen';
import { DoneScreen } from './screens/DoneScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { AdminScreen } from './screens/AdminScreen';

function useHashRoute(): string {
  const [hash, setHash] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

type Screen = 'home' | 'quiz' | 'correct' | 'failed' | 'done' | 'history';

const MAX_ATTEMPTS = 3;

function App() {
  const hash = useHashRoute();
  if (import.meta.env.DEV && hash === '#admin') {
    return <AdminScreen />;
  }

  return <MainApp />;
}

function MainApp() {
  const store = useStore();
  const userHashRef = useRef<string>(store.userId);
  const [screen, setScreen] = useState<Screen>('home');
  const [value, setValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  type AdState = 'idle' | 'loading' | 'ready' | 'failed';
  const [adState, setAdState] = useState<AdState>('idle');
  const rewardedUnregRef = useRef<(() => void) | null>(null);
  const adTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    getAnonymousKey().then((result) => {
      if (result && typeof result === 'object' && result.type === 'HASH') {
        userHashRef.current = result.hash;
      }
    }).catch(() => {});
  }, []);

  const loadRewardedAd = useCallback(() => {
    try {
      if (!loadFullScreenAd.isSupported()) return;
      rewardedUnregRef.current?.();
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);

      setAdState('loading');

      const unregister = loadFullScreenAd({
        options: { adGroupId: 'ait.v2.live.775d02dd52984660' },
        onEvent: (event) => {
          if (event.type === 'loaded') {
            clearTimeout(adTimeoutRef.current!);
            setAdState('ready');
          }
        },
        onError: () => {
          clearTimeout(adTimeoutRef.current!);
          setAdState('failed');
        },
      });

      adTimeoutRef.current = setTimeout(() => setAdState('failed'), 12000);
      rewardedUnregRef.current = unregister;
    } catch {
      setAdState('failed');
    }
  }, []);

  useEffect(() => {
    loadRewardedAd();
    return () => {
      rewardedUnregRef.current?.();
      if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
    };
  }, [loadRewardedAd]);

  const watchRewardedAd = useCallback(() => {
    try {
      if (!showFullScreenAd.isSupported() || adState !== 'ready') return;
      setAdState('idle');
      showFullScreenAd({
        options: { adGroupId: 'ait.v2.live.775d02dd52984660' },
        onEvent: (event) => {
          if (event.type === 'userEarnedReward') {
            store.addHint();
          }
          if (event.type === 'dismissed') {
            setShowHintModal(false);
            loadRewardedAd();
          }
        },
        onError: () => {
          setAdState('failed');
          loadRewardedAd();
        },
      });
    } catch { /* 토스 앱 환경 아님 */ }
  }, [adState, loadRewardedAd, store]);

  useEffect(() => {
    if (!hydrated) return;
    store.tickDate();
    loadQuizzes();
  }, [hydrated]);

  useEffect(() => {
    setAttempts(0);
    setValue('');
  }, [store.currentIdx]);

  const loadQuizzes = async () => {
    if (store.cachedDate === todayKST && store.cachedQuizzes.length === 5) return;
    setLoading(true);
    try {
      const quizzes = await fetchTodayQuizzes();
      if (quizzes.length === 5) {
        store.setCachedQuizzes(quizzes);
      }
    } catch {
      // no fallback
    } finally {
      setLoading(false);
    }
  };

  const todayKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const quizzes = (store.cachedDate === todayKST && store.cachedQuizzes.length === 5) ? store.cachedQuizzes : [];
  const hasQuizzes = quizzes.length === 5;
  const currentQuiz = quizzes[store.currentIdx];
  const nextUnsolvedIdx = quizzes.findIndex(
    (_, i) => !store.solvedToday.includes(i) && !store.failedToday.includes(i)
  );
  const previewQuiz = nextUnsolvedIdx >= 0 ? quizzes[nextUnsolvedIdx] : null;
  const allDone = hasQuizzes && (store.solvedToday.length + store.failedToday.length) === 5;

  const startQuiz = () => {
    const idx = nextUnsolvedIdx >= 0 ? nextUnsolvedIdx : 0;
    store.setCurrentIdx(idx);
    setScreen('quiz');
  };

  const submit = useCallback(() => {
    if (!currentQuiz) return;
    const mask = store.hintMasks[store.currentIdx];
    let typed: string;
    if (mask && mask.some((c) => c !== null)) {
      let typedIdx = 0;
      typed = mask.map((m) => {
        if (m) return m;
        const ch = value[typedIdx] ?? '';
        typedIdx++;
        return ch.toUpperCase();
      }).join('');
    } else {
      typed = value.trim().toUpperCase();
    }

    if (typed === currentQuiz.word.toUpperCase()) {
      store.setSolvedToday(store.currentIdx);
      setScreen('correct');
      saveQuizResult({
        userId: userHashRef.current,
        quizId: currentQuiz.id,
        quizDate: store.currentDate,
        position: currentQuiz.position,
        word: currentQuiz.word,
        solved: true,
        attempts: attempts + 1,
        hintUsed: store.hintsUsedToday > 0,
      });
    } else {
      const newAttempts = attempts + 1;
      store.submitAnswer(currentQuiz.word, false);
      if (newAttempts >= MAX_ATTEMPTS) {
        store.setFailedToday(store.currentIdx);
        setScreen('failed');
        saveQuizResult({
          userId: userHashRef.current,
          quizId: currentQuiz.id,
          quizDate: store.currentDate,
          position: currentQuiz.position,
          word: currentQuiz.word,
          solved: false,
          attempts: newAttempts,
          hintUsed: store.hintsUsedToday > 0,
        });
      } else {
        setAttempts(newAttempts);
        setValue('');
        setShake(true);
        setTimeout(() => setShake(false), 400);
      }
    }
  }, [currentQuiz, value, attempts, store]);

  const goNext = () => {
    const nextIdx = quizzes.findIndex(
      (_, i) => i > store.currentIdx &&
        !store.solvedToday.includes(i) &&
        !store.failedToday.includes(i)
    );
    if (nextIdx >= 0) {
      store.setCurrentIdx(nextIdx);
      setScreen('quiz');
    } else {
      setScreen('done');
    }
  };

  const useHint = () => {
    if (!currentQuiz) return;
    store.useHint(store.currentIdx, currentQuiz.word);
    setValue('');
    setShowHintModal(false);
  };

  if (!hydrated || loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        🎨
      </div>
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {screen === 'home' && (
        <HomeScreen
          progress={store.solvedToday.length}
          previewQuiz={previewQuiz}
          hasQuizzes={hasQuizzes}
          allDone={allDone}
          onStart={startQuiz}
          onHistory={() => setScreen('history')}
        />
      )}

      {screen === 'quiz' && currentQuiz && (
        <>
          <QuizScreen
            quiz={currentQuiz}
            qIdx={store.currentIdx}
            total={quizzes.length}
            hints={store.hintsRemaining}
            hintMask={store.hintMasks[store.currentIdx]}
            value={value}
            setValue={setValue}
            onSubmit={submit}
            onHint={() => setShowHintModal(true)}
            onHome={() => setScreen('home')}
            shake={shake}
            attempts={attempts}
            maxAttempts={MAX_ATTEMPTS}
          />
          {showHintModal && (
            <HintModal
              remaining={store.hintsRemaining}
              onUse={useHint}
              onClose={() => setShowHintModal(false)}
              onWatchAd={watchRewardedAd}
              adState={adState === 'idle' ? 'loading' : adState}
            />
          )}
        </>
      )}

      {screen === 'correct' && currentQuiz && (
        <CorrectScreen
          qIdx={store.currentIdx}
          total={quizzes.length}
          word={currentQuiz.word}
          meaning={currentQuiz.meaning}
          onNext={goNext}
        />
      )}

      {screen === 'failed' && currentQuiz && (
        <FailedScreen
          qIdx={store.currentIdx}
          total={quizzes.length}
          word={currentQuiz.word}
          meaning={currentQuiz.meaning}
          onNext={goNext}
        />
      )}

      {screen === 'done' && (
        <DoneScreen
          correct={store.solvedToday.length}
          total={quizzes.length}
          hintsUsed={store.hintsUsedToday}
          hintsLeft={store.hintsRemaining}
          onAgain={() => setScreen('home')}
        />
      )}

      {screen === 'history' && (
        <HistoryScreen onBack={() => setScreen('home')} />
      )}
    </div>
  );
}

export default App;
