/**
 * 매일 KST 00:05에 GitHub Actions로 실행.
 * GPT-4o로 5개 영단어 선정 → DALL-E 3로 낙서 이미지 생성 →
 * Supabase Storage 'doodles' 버킷에 업로드 → daily_quizzes 테이블에 upsert.
 *
 * 환경변수 (GitHub Secrets에 설정):
 *   OPENAI_API_KEY
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'doodles';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

function todayKST() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

async function getPastWords() {
  const { data, error } = await supabase
    .from('daily_quizzes')
    .select('word');
  if (error) throw error;
  return [...new Set(data.map((r) => r.word.toUpperCase()))];
}

async function generateWords(date) {
  const pastWords = await getPastWords();
  const avoidList = pastWords.length > 0 ? `\nAlready used words (DO NOT use these): ${pastWords.join(', ')}` : '';

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a quiz game designer for a daily doodle quiz app.
Generate exactly 5 English words. Players see a hand-drawn sketch and guess the word.

Rules:
- Only concrete nouns (animals, objects, food, nature, vehicles, household items)
- Uppercase
- Mix of medium and hard difficulty: mostly medium-hard (COMPASS, LANTERN, ANVIL, PERISCOPE, CACTUS), with 1 simple one (CAT, APPLE)
- Avoid extremely obscure words (e.g. SEXTANT, ASTROLABE)
- Must be drawable as a simple sketch
- No abstract concepts, no proper nouns
${avoidList}

Today: ${date}

Return JSON exactly: {"quizzes": [{"word": "APPLE", "meaning": "사과"}]}
The "meaning" field MUST be a Korean translation (한국어 뜻), not an English description.`,
      },
      { role: 'user', content: 'Generate 5 quiz words for today.' },
    ],
  });

  const parsed = JSON.parse(res.choices[0].message.content);
  if (!Array.isArray(parsed.quizzes) || parsed.quizzes.length !== 5) {
    throw new Error(`Unexpected GPT response: ${JSON.stringify(parsed)}`);
  }
  return parsed.quizzes;
}

async function generateDoodleImageBase64(word) {
  const res = await openai.images.generate({
    model: 'gpt-image-2',
    prompt: `Draw a very simple, low-difficulty vocabulary illustration in a cute crayon doodle style on a plain white background.

The main object should be large, centered, and immediately recognizable.
Use thick, slightly shaky black outlines, rough hand-colored crayon texture, soft childlike proportions, and bright simple colors.
Make it feel like a neat but imperfect kindergarten drawing: cute, friendly, and innocent, not polished, not realistic, not detailed.

Keep the composition minimal.
Add only 1–3 tiny background hints related to the object, such as a sun, cloud, grass, bubble, or small ground line, but make sure the main object is much more visually dominant than the background.

Do not include any text, labels, letters, or words.
For animals, always draw simple eyes (two small dots or circles). Keep the face minimal but recognizable.
Do not make it realistic, glossy, 3D, or professional.
Do not make it too messy or ugly — it should be simple, adorable, and easy to guess.

Object: ${word}`,
    size: '1024x1024',
    quality: 'low',
    n: 1,
  });
  return res.data[0].b64_json;
}

async function uploadToStorage(b64, date, position) {
  const buffer = Buffer.from(b64, 'base64');

  const path = `${date}/${position}.png`;
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      upsert: true,
      contentType: 'image/png',
      cacheControl: '31536000',
    });
  if (uploadErr) throw uploadErr;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function generateOne(date, position) {
  const [{ word, meaning }] = await (async () => {
    const pastWords = await getPastWords();
    const avoidList = pastWords.length > 0 ? `\nAlready used words (DO NOT use these): ${pastWords.join(', ')}` : '';
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a quiz game designer for a daily doodle quiz app.
Generate exactly 1 English word. Players see a hand-drawn sketch and guess the word.

Rules:
- Only concrete nouns (animals, objects, food, nature, vehicles, household items)
- Uppercase
- Mix of medium and hard difficulty
- Must be drawable as a simple sketch
- No abstract concepts, no proper nouns
${avoidList}

Return JSON exactly: {"quizzes": [{"word": "APPLE", "meaning": "사과"}]}
The "meaning" field MUST be a Korean translation (한국어 뜻), not an English description.`,
        },
        { role: 'user', content: 'Generate 1 quiz word.' },
      ],
    });
    return JSON.parse(res.choices[0].message.content).quizzes;
  })();

  console.log(`[${position}/5] ${word} — generating image...`);
  const b64 = await generateDoodleImageBase64(word);

  console.log(`[${position}/5] ${word} — uploading to Storage...`);
  const publicUrl = await uploadToStorage(b64, date, position);

  console.log(`[${position}/5] ${word} — inserting to DB...`);
  const { error } = await supabase.from('daily_quizzes').upsert(
    { quiz_date: date, position, word: word.toUpperCase(), meaning, doodle_png: publicUrl },
    { onConflict: 'quiz_date,position' }
  );
  if (error) throw error;
  console.log(`[${position}/5] ${word} — done ✓\n`);
}

async function main() {
  const date = process.env.QUIZ_DATE || todayKST();
  const targetPosition = process.env.QUIZ_POSITION ? parseInt(process.env.QUIZ_POSITION) : null;

  if (targetPosition) {
    console.log(`\n=== Regenerating position ${targetPosition} for ${date} ===\n`);
    await generateOne(date, targetPosition);
  } else {
    console.log(`\n=== Generating quizzes for ${date} ===\n`);
    const words = await generateWords(date);
    console.log('Words:', words.map((w) => `${w.word}(${w.meaning})`).join(', '), '\n');

    for (let i = 0; i < words.length; i++) {
      const { word, meaning } = words[i];
      const position = i + 1;

      console.log(`[${position}/5] ${word} — generating image...`);
      const b64 = await generateDoodleImageBase64(word);

      console.log(`[${position}/5] ${word} — uploading to Storage...`);
      const publicUrl = await uploadToStorage(b64, date, position);

      console.log(`[${position}/5] ${word} — inserting to DB...`);
      const { error } = await supabase.from('daily_quizzes').upsert(
        { quiz_date: date, position, word: word.toUpperCase(), meaning, doodle_png: publicUrl },
        { onConflict: 'quiz_date,position' }
      );
      if (error) throw error;
      console.log(`[${position}/5] ${word} — done ✓\n`);
    }
  }

  console.log('=== All done! ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
