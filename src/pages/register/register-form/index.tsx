'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import { getAuthErrorMessage, MagicLinkSent, sendOtp } from '@/features/auth';
import type { FormStatus } from '@/shared/types';
import styles from './styles.module.scss';
import { INITIAL_DATA, type FormData } from './lib';

export const RegisterForm = () => {
    const [data, setData] = useState<FormData>(INITIAL_DATA);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const updateField = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) =>
        setData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const { error } = await sendOtp({
            email: data.email,
            shouldCreateUser: true,
            userData: {
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
            },
        });

        if (error) {
            setStatus('error');
            setErrorMessage(getAuthErrorMessage(error.message, 'Не удалось создать аккаунт. Попробуйте позже.'));
            return;
        }

        setStatus('success');
    };

    if (status === 'success') {
        return (
            <MagicLinkSent
                email={data.email}
                text="отправлена ссылка. Откройте её на этом устройстве — после подтверждения аккаунт будет создан."
            />
        );
    }

    const isLoading = status === 'loading';
    const isValid = data.email && data.firstName && data.lastName && data.phone;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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
                {isLoading ? 'Создаём...' : 'Создать аккаунт'}
            </button>

            <p className={styles.hint}>На email придёт ссылка для подтверждения</p>

            <Link href="/login" className={styles.link}>
                У меня уже есть аккаунт
            </Link>
        </form>
    );
};