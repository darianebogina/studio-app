'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { getAuthErrorMessage, OtpCodeForm, sendOtp, type SendOtpResult } from '@/features/auth';
import type { FormStatus } from '@/shared/types';
import { Spinner } from '@/shared/ui-kit';
import styles from './styles.module.scss';

const NETWORK_ERROR_RESULT: SendOtpResult = { ok: false, error: 'unknown' };

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const result = await sendOtp({ email, shouldCreateUser: false }).catch(() => NETWORK_ERROR_RESULT);

        if (!result.ok) {
            setStatus('error');
            setErrorMessage(getAuthErrorMessage(result.error, 'Не удалось отправить код. Попробуйте позже.'));
            return;
        }

        setStatus('success');
    };

    const handleChangeEmail = () => setStatus('idle');

    if (status === 'success') {
        return (
            <OtpCodeForm
                sendParams={{ email, shouldCreateUser: false }}
                onChangeEmail={handleChangeEmail}
            />
        );
    }

    const isLoading = status === 'loading';

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
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
                {isLoading ? <Spinner size="md" color="dark" /> : 'Прислать код'}
            </button>

            <Link href="/register" className={styles.link}>
                У меня нет аккаунта
            </Link>
        </form>
    );
};
