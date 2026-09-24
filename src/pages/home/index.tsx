import { createServerClient } from '@/shared/api/server';
import { redirect } from 'next/navigation';

export const HomePage = async () => {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Logged in as {user.email}</div>;
};

