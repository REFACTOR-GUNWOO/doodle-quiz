import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

export async function saveQuizResult(params: {
  userId: string;
  quizId: string;
  quizDate: string;
  position: number;
  word: string;
  solved: boolean;
  attempts: number;
  hintUsed: boolean;
}): Promise<void> {
  await supabase.from('quiz_results').insert({
    user_id: params.userId,
    quiz_id: params.quizId,
    quiz_date: params.quizDate,
    position: params.position,
    word: params.word,
    solved: params.solved,
    attempts: params.attempts,
    hint_used: params.hintUsed,
  });
}
