'use client';

import { useTransition } from 'react';
import { resetSubscription } from '../../api/reset-subscription';
import { CONFIRM_MESSAGE, getResetErrorMessage, type ResetResult } from '../../lib';
import styles from './styles.module.scss';

type ResetSubscriptionButtonProps = {
    userId: string;
    onSuccess?: () => void;
    disabled?: boolean;
};

const NETWORK_ERROR_RESULT: ResetResult = { ok: false, error: 'unknown' };

export const ResetSubscriptionButton = ({ userId, onSuccess, disabled }: ResetSubscriptionButtonProps) => {
    const [isPending, startTransition] = useTransition();

    // Нативные confirm() и alert(): своего ConfirmDialog в ui-kit пока нет
    const handleClick = () => {
        if (!window.confirm(CONFIRM_MESSAGE)) return;

        startTransition(async () => {
            const result = await resetSubscription({ userId }).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                window.alert(getResetErrorMessage(result.error));
                return;
            }

            onSuccess?.();
        });
    };

    return (
        <button
            type="button"
            disabled={disabled || isPending}
            onClick={handleClick}
            className={styles.resetSubscriptionButton}
        >
            {isPending ? 'Аннулируем...' : 'Аннулировать абонемент'}
        </button>
    );
};
