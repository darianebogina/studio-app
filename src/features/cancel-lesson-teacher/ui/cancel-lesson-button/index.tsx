'use client';

import { useState, useTransition } from 'react';
import { confirm, toast } from '@/shared/ui-kit';
import { cancelLesson } from '../../api/cancel-lesson';
import { CONFIRM_OPTIONS, getCancelLessonErrorMessage, type CancelLessonResult } from '../../lib';
import styles from './styles.module.scss';

type CancelLessonButtonProps = {
    lessonId: string;
    onSuccess?: () => void;
};

const NETWORK_ERROR_RESULT: CancelLessonResult = { ok: false, error: 'unknown' };

export const CancelLessonButton = ({ lessonId, onSuccess }: CancelLessonButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState('');

    const handleClick = async () => {
        const isConfirmed = await confirm(CONFIRM_OPTIONS);
        if (!isConfirmed) return;

        setErrorMessage('');

        startTransition(async () => {
            const result = await cancelLesson({ lessonId }).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                const message = getCancelLessonErrorMessage(result.error);
                setErrorMessage(message);
                toast.error(message);
                return;
            }

            toast.success('Занятие отменено');
            onSuccess?.();
        });
    };

    return (
        <div className={styles.cancelLessonButton}>
            <button
                type="button"
                disabled={isPending}
                onClick={handleClick}
                className={styles.button}
            >
                {isPending ? 'Отменяем...' : 'Отменить занятие'}
            </button>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
};
