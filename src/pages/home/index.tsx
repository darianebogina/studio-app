import { redirect } from 'next/navigation';
import { getUserRole } from '@/shared/lib/utils';

export const HomePage = async () => {
    const user = await getUserRole();

    if (!user) {
        redirect('/login');
    }

    redirect(user.role === 'teacher' ? '/teacher' : '/home');
};
