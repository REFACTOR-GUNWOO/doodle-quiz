import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Quiz } from '../store';

export const DOODLE_BUCKET = 'doodles';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as
  | string
  | undefined;

let _admin: SupabaseClient | null = null;

export function isAdminEnabled(): boolean {
  return Boolean(import.meta.env.DEV && SUPABASE_URL && SERVICE_ROLE_KEY);
}

function getAdmin(): SupabaseClient {
  if (!isAdminEnabled()) {
    throw new Error(
      'Admin client unavailable. Set VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local and run in dev mode.'
    );
  }
  if (!_admin) {
    _admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

export type AdminQuizRow = {
  quiz_date: string;
  position: number;
  word: string;
  meaning: string;
  doodle_png: string | null;
};

export async function fetchQuizzesForDate(date: string): Promise<AdminQuizRow[]> {
  const admin = getAdmin();
  const { data, error } = await admin
    .from('daily_quizzes')
    .select('quiz_date, position, word, meaning, doodle_png')
    .eq('quiz_date', date)
    .order('position');
  if (error) throw error;
  return (data ?? []) as AdminQuizRow[];
}

export async function upsertQuizRow(row: AdminQuizRow): Promise<void> {
  const admin = getAdmin();
  const { error } = await admin
    .from('daily_quizzes')
    .upsert(row, { onConflict: 'quiz_date,position' });
  if (error) throw error;
}

export async function deleteQuizRow(date: string, position: number): Promise<void> {
  const admin = getAdmin();
  const { error } = await admin
    .from('daily_quizzes')
    .delete()
    .eq('quiz_date', date)
    .eq('position', position);
  if (error) throw error;
}

export async function uploadDoodle(
  date: string,
  position: number,
  file: File
): Promise<string> {
  const admin = getAdmin();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${date}/${position}.${ext}`;
  const { error: uploadErr } = await admin.storage
    .from(DOODLE_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || 'image/png',
      cacheControl: '3600',
    });
  if (uploadErr) throw uploadErr;
  const { data } = admin.storage.from(DOODLE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export type { Quiz };
