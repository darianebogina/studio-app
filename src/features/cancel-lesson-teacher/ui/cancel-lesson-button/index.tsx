'use client';

import { useState, useTransition } from 'react';
import { cancelLesson } from '../../api/cancel-lesson';
import { CONFIRM_MESSAGE, getCancelLessonErrorMessage, type CancelLessonResult } from '../../lib';
import styles from './styles.module.scss';

type CancelLessonButtonProps = {
    lessonId: string;
    onSuccess?: () => void;
};

const NETWORK_ERROR_RESULT: CancelLessonResult = { ok: false, error: 'unknown' };

export const CancelLessonButton = ({ lessonId, onSuccess }: CancelLessonButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState('');

    // Нативный confirm(): своего ConfirmDialog в ui-kit пока нет
    const handleClick = () => {
        if (!window.confirm(CONFIRM_MESSAGE)) return;

        setErrorMessage('');

        startTransition(async () => {
            const result = await cancelLesson({ lessonId }).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                setErrorMessage(getCancelLessonErrorMessage(result.error));
                return;
            }

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
