import { createClient } from '@/shared/api/supabase/server';
import { redirect } from 'next/navigation';

export const HomePage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Logged in as {user.email}</div>;
};

