'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';
import { confirmEmail, getConfirmEmailErrorMessage, type ConfirmEmailResult } from '@/features/auth';
import { Spinner } from '@/shared/ui-kit';
import styles from './styles.module.scss';

const NETWORK_ERROR_RESULT: ConfirmEmailResult = { ok: false, error: 'unknown' };

type ConfirmEmailFormProps = {
    tokenHash: string;
    type: string;
};

export const ConfirmEmailForm = ({ tokenHash, type }: ConfirmEmailFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState('');

    const handleConfirm = () => {
        setErrorMessage('');

        startTransition(async () => {
            // При успехе action редиректит на /: промис отклоняется redirect-ошибкой, её отдаём Next
            const result = await confirmEmail({ tokenHash, type }).catch((error) => {
                unstable_rethrow(error);
                return NETWORK_ERROR_RESULT;
            });

            setErrorMessage(getConfirmEmailErrorMessage(result.error));
        });
    };

    return (
        <div className={styles.confirmEmailForm}>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            <button
                type="button"
                disabled={isPending}
                onClick={handleConfirm}
                className={styles.button}
            >
                {isPending ? <Spinner size="md" color="dark" /> : 'Войти'}
            </button>

            {errorMessage && (
                <Link href="/login" className={styles.link}>
                    Запросить новую ссылку
                </Link>
            )}
        </div>
    );
};
