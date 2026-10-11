'use client';

import { useTransition } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { Spinner, toast } from '@/shared/ui-kit';
import { logout } from '../api/logout';
import { LOGOUT_ERROR_MESSAGE, type LogoutResult } from '../lib';
import styles from './styles.module.scss';

const NETWORK_ERROR_RESULT: LogoutResult = { ok: false, error: 'unknown' };

export const LogoutButton = () => {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            // При успехе action редиректит на /login: промис отклоняется redirect-ошибкой, её отдаём Next
            await logout().catch((error) => {
                unstable_rethrow(error);
                return NETWORK_ERROR_RESULT;
            });

            toast.error(LOGOUT_ERROR_MESSAGE);
        });
    };

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleLogout}
            className={styles.logoutButton}
        >
            {isPending ? <Spinner size="md" /> : 'Выйти'}
        </button>
    );
};
