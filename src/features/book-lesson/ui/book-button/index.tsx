'use client';

import { useState, useTransition } from 'react';
import { toast } from '@/shared/ui-kit';
import { bookLesson } from '../../api/book-lesson';
import { getBookErrorMessage, type BookLessonResult } from '../../lib';
import styles from './styles.module.scss';

type BookButtonProps = {
    lessonId: string;
    onSuccess?: () => void;
    className?: string;
};

const NETWORK_ERROR_RESULT: BookLessonResult = { ok: false, error: 'unknown' };

export const BookButton = ({ lessonId, onSuccess, className }: BookButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState('');

    const handleClick = () => {
        setErrorMessage('');

        startTransition(async () => {
            const result = await bookLesson(lessonId).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                const message = getBookErrorMessage(result.error);
                setErrorMessage(message);
                toast.error(message);
                return;
            }

            toast.success('Вы записались на занятие');
            onSuccess?.();
        });
    };

    return (
        <div className={`${styles.bookButton} ${className ?? ''}`}>
            <button
                type="button"
                disabled={isPending}
                onClick={handleClick}
                className={styles.button}
            >
                {isPending ? 'Записываем...' : 'Записаться'}
            </button>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
};
