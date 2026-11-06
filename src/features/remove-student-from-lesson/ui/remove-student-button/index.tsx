'use client';

import { useTransition } from 'react';
import { UserMinus } from 'lucide-react';
import { confirm, Spinner, toast } from '@/shared/ui-kit';
import { removeStudentFromLesson } from '../../api/remove-student-from-lesson';
import {
    getConfirmOptions,
    getRemoveStudentErrorMessage,
    REMOVE_ICON_SIZE,
    type RemoveStudentResult,
} from '../../lib';
import styles from './styles.module.scss';

type RemoveStudentButtonProps = {
    bookingId: string;
    studentName: string;
    disabled?: boolean;
    onRemoved?: () => void;
};

const NETWORK_ERROR_RESULT: RemoveStudentResult = { ok: false, error: 'unknown' };

export const RemoveStudentButton = ({ bookingId, studentName, disabled, onRemoved }: RemoveStudentButtonProps) => {
    const [isPending, startTransition] = useTransition();

    const handleClick = async () => {
        const isConfirmed = await confirm(getConfirmOptions(studentName));
        if (!isConfirmed) return;

        startTransition(async () => {
            const result = await removeStudentFromLesson({ bookingId }).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                toast.error(getRemoveStudentErrorMessage(result.error));
                return;
            }

            toast.success('Ученик убран с занятия');
            onRemoved?.();
        });
    };

    return (
        <button
            type="button"
            disabled={disabled || isPending}
            aria-label={`Убрать ${studentName} с занятия`}
            onClick={handleClick}
            className={styles.removeStudentButton}
        >
            {isPending ? <Spinner size="sm" /> : <UserMinus size={REMOVE_ICON_SIZE} aria-hidden="true" />}
        </button>
    );
};
