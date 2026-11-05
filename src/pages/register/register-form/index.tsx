'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { getAuthErrorMessage, OtpCodeForm, sendOtp, type SendOtpParams, type SendOtpResult } from '@/features/auth';
import type { FormStatus } from '@/shared/types';
import { Spinner } from '@/shared/ui-kit';
import { INITIAL_DATA, type RegisterFormData } from './lib';
import styles from './styles.module.scss';

const NETWORK_ERROR_RESULT: SendOtpResult = { ok: false, error: 'unknown' };

export const RegisterForm = () => {
    const [data, setData] = useState<RegisterFormData>(INITIAL_DATA);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const sendParams: SendOtpParams = {
        email: data.email,
        shouldCreateUser: true,
        userData: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
        },
    };

    const updateField = (field: keyof RegisterFormData) => (e: ChangeEvent<HTMLInputElement>) =>
        setData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const result = await sendOtp(sendParams).catch(() => NETWORK_ERROR_RESULT);

        if (!result.ok) {
            setStatus('error');
            setErrorMessage(getAuthErrorMessage(result.error, 'Не удалось создать аккаунт. Попробуйте позже.'));
            return;
        }

        setStatus('success');
    };

    const handleChangeEmail = () => setStatus('idle');

    if (status === 'success') {
        return (
            <OtpCodeForm
                sendParams={sendParams}
                onChangeEmail={handleChangeEmail}
            />
        );
    }

    const isLoading = status === 'loading';
    const isValid = Object.values(data).every(Boolean);

    return (
        <form onSubmit={handleSubmit} className={styles.registerForm}>
            <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input
                    type="email"
                    placeholder="your@email.com"
                    value={data.email}
                    onChange={updateField('email')}
                    required
                    disabled={isLoading}
                    className={styles.input}
                />
            </label>

            <label className={styles.field}>
                <span className={styles.label}>Имя</span>
                <input
                    type="text"
                    placeholder="Анна"
                    value={data.firstName}
                    onChange={updateField('firstName')}
                    required
                    disabled={isLoading}
                    className={styles.input}
                />
            </label>

            <label className={styles.field}>
                <span className={styles.label}>Фамилия</span>
                <input
                    type="text"
                    placeholder="Иванова"
                    value={data.lastName}
                    onChange={updateField('lastName')}
                    required
                    disabled={isLoading}
                    className={styles.input}
                />
            </label>

            <label className={styles.field}>
                <span className={styles.label}>Телефон</span>
                <input
                    type="tel"
                    placeholder="+7 900 123 45 67"
                    value={data.phone}
                    onChange={updateField('phone')}
                    required
                    disabled={isLoading}
                    className={styles.input}
                />
            </label>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            <button
                type="submit"
                disabled={isLoading || !isValid}
                className={styles.button}
            >
                {isLoading ? <Spinner size="md" color="dark" /> : 'Создать аккаунт'}
            </button>

            <p className={styles.hint}>На email придёт код для подтверждения</p>

            <Link href="/login" className={styles.link}>
                У меня уже есть аккаунт
            </Link>
        </form>
    );
};
