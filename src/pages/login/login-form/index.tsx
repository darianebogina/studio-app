'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { getAuthErrorMessage, MagicLinkSent, sendOtp } from '@/features/auth';
import type { FormStatus } from '@/shared/types';
import styles from './styles.module.scss';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const { error } = await sendOtp({ email, shouldCreateUser: false });

        if (error) {
            setStatus('error');
            setErrorMessage(getAuthErrorMessage(error.message, 'Не удалось отправить письмо. Попробуйте позже.'));
            return;
        }

        setStatus('success');
    };

    const handleReset = () => setStatus('idle');

    if (status === 'success') {
        return (
            <MagicLinkSent
                email={email}
                text="отправлена ссылка для входа. Откройте её на этом устройстве."
                onReset={handleReset}
                resetLabel="Отправить ещё раз"
            />
        );
    }

    const isLoading = status === 'loading';

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={styles.input}
            />

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            <button
                type="submit"
                disabled={isLoading || !email}
                className={styles.button}
            >
                {isLoading ? 'Отправляем...' : 'Прислать ссылку'}
            </button>

            <Link href="/register" className={styles.link}>
                У меня нет аккаунта
            </Link>
        </form>
    );
};