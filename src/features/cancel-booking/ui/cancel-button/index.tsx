'use client';

import { useState, useTransition } from 'react';
import { toast } from '@/shared/ui-kit';
import { cancelBooking } from '../../api/cancel-booking';
import { CONFIRM_MESSAGE, getCancelErrorMessage, type CancelBookingResult } from '../../lib';
import styles from './styles.module.scss';

type CancelButtonProps = {
    lessonId: string;
    onSuccess?: () => void;
    className?: string;
};

const NETWORK_ERROR_RESULT: CancelBookingResult = { ok: false, error: 'unknown' };

export const CancelButton = ({ lessonId, onSuccess, className }: CancelButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState('');

    // Нативный confirm(): своего ConfirmDialog в ui-kit пока нет
    const handleClick = () => {
        if (!window.confirm(CONFIRM_MESSAGE)) return;

        setErrorMessage('');

        startTransition(async () => {
            const result = await cancelBooking(lessonId).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                const message = getCancelErrorMessage(result.error);
                setErrorMessage(message);
                toast.error(message);
                return;
            }

            toast.success('Запись отменена');
            onSuccess?.();
        });
    };

    return (
        <div className={`${styles.cancelButton} ${className ?? ''}`}>
            <button
                type="button"
                disabled={isPending}
                onClick={handleClick}
                className={styles.button}
            >
                {isPending ? 'Отменяем...' : 'Отменить запись'}
            </button>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
};
