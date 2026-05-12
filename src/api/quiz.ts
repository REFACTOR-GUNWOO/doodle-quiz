import { createClient } from '@supabase/supabase-js';
import type { Quiz } from '../store';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function todayKST(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export async function fetchTodayQuizzes(): Promise<Quiz[]> {
  const date = todayKST();
  const { data, error } = await supabase
    .from('daily_quizzes')
    .select('id, position, word, meaning, doodle_png')
    .eq('quiz_date', date)
    .order('position');

  if (error) throw error;
  return ((data ?? []) as Quiz[]).map((q) => ({
    ...q,
    doodle_png: q.doodle_png ? `${q.doodle_png}?v=${date}` : null,
  }));
}
