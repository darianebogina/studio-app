import { createClient } from '@/shared/api/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();

  const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .order('starts_at', { ascending: true })
      .limit(10);

  return (
      <main style={{ padding: 20, fontFamily: 'system-ui' }}>
        <h1>Тест подключения к Supabase</h1>

        {error && (
            <div style={{ color: 'red' }}>
              Ошибка: {error.message}
            </div>
        )}

        {lessons && (
            <>
              <p>Получено занятий: {lessons.length}</p>
              <pre style={{ background: '#eee', padding: 10, fontSize: 12 }}>
            {JSON.stringify(lessons, null, 2)}
          </pre>
            </>
        )}
      </main>
  );
}