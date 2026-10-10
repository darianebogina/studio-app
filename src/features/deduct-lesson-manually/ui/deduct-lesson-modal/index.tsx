'use client';

import { useState, useTransition } from 'react';
import type { LessonKind } from '@/shared/types';
import { Modal, toast } from '@/shared/ui-kit';
import { deductLessonManually } from '../../api/deduct-lesson-manually';
import { getDeductErrorMessage, LESSON_KINDS, type DeductResult } from '../../lib';
import styles from './styles.module.scss';

type DeductLessonModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
};

const NETWORK_ERROR_RESULT: DeductResult = { ok: false, error: 'unknown' };

export const DeductLessonModal = ({
    isOpen,
    onClose,
    userId,
    userName,
}: DeductLessonModalProps) => {
    const [selectedKind, setSelectedKind] = useState<LessonKind | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    // Модалка остаётся смонтированной, поэтому выбор сбрасываем сами
    const handleClose = () => {
        setSelectedKind(null);
        setErrorMessage('');
        onClose();
    };

    const handleSubmit = () => {
        if (!selectedKind) return;

        setErrorMessage('');

        startTransition(async () => {
            const result = await deductLessonManually({ userId, lessonKind: selectedKind })
                .catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                const message = getDeductErrorMessage(result.error);
                setErrorMessage(message);
                toast.error(message);
                return;
            }

            toast.success('Занятие списано');
            handleClose();
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Списать занятие"
            onClose={handleClose}
        >
            <p className={styles.userName}>{userName}</p>

            <fieldset className={styles.section}>
                <legend className={styles.label}>Тип занятия</legend>

                <div className={styles.kinds}>
                    {LESSON_KINDS.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={value === selectedKind}
                            onClick={() => setSelectedKind(value)}
                            className={`${styles.kind} ${value === selectedKind ? styles.selected : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </fieldset>

            <button
                type="button"
                disabled={!selectedKind || isPending}
                onClick={handleSubmit}
                className={styles.submit}
            >
                {isPending ? 'Списываем...' : 'Списать 1 занятие'}
            </button>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </Modal>
    );
};
