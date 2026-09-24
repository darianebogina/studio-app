'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/shared/api/supabase/client';
import styles from './styles.module.scss';

type Status = 'idle' | 'loading' | 'success' | 'error';

const getErrorMessage = (message: string) =>
    message === 'Signups not allowed for otp'
        ? 'Аккаунт не найден. Сначала зарегистрируйтесь.'
        : 'Не удалось отправить письмо. Попробуйте позже.';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                shouldCreateUser: false,
            },
        });

        if (error) {
            setStatus('error');
            setErrorMessage(getErrorMessage(error.message));
            return;
        }

        setStatus('success');
    };

    const handleReset = () => setStatus('idle');

    if (status === 'success') {
        return (
            <div className={styles.success}>
                <p className={styles.successTitle}>Проверьте почту</p>
                <p className={styles.successText}>
                    На <b>{email}</b> отправлена ссылка для входа. Откройте её на этом устройстве.
                </p>
                <button type="button" onClick={handleReset} className={styles.linkButton}>
                    Отправить ещё раз
                </button>
            </div>
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