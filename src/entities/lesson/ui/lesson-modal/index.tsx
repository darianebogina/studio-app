import type { ReactNode } from 'react';
import { formatFullDate, formatLessonTime } from '@/shared/lib/date';
import type { Lesson } from '@/shared/types';
import { Modal } from '@/shared/ui-kit';
import { LESSON_META_LABELS, LESSON_TITLES } from '../../model/types';
import { DEDUCTION_HINTS, formatDuration } from './lib';
import styles from './styles.module.scss';

// Кнопки записи и отмены живут в фичах, которые сущность импортировать не может, поэтому приходят слотом
type LessonModalProps = {
    lesson: Lesson | null;
    actions: ReactNode;
    onClose: () => void;
};

export const LessonModal = ({ lesson, actions, onClose }: LessonModalProps) => {
    if (!lesson) return null;

    const { type, starts_at: startsAt, duration_min: durationMin, status } = lesson;
    const isCancelled = status === 'cancelled';

    return (
        <Modal
            isOpen
            title={LESSON_TITLES[type]}
            onClose={onClose}
        >
            <span className={`${styles.badge} ${styles[type]}`}>{LESSON_META_LABELS[type]}</span>

            <div className={styles.details}>
                <p className={styles.date}>{formatFullDate(startsAt)}</p>
                <p className={styles.time}>
                    {formatLessonTime(startsAt)} · {formatDuration(durationMin)}
                </p>
            </div>

            {isCancelled && <p className={styles.cancelled}>Занятие отменено</p>}

            {!isCancelled && (
                <div className={styles.actions}>
                    {actions}

                    <p className={styles.hint}>{DEDUCTION_HINTS[type]}</p>
                </div>
            )}
        </Modal>
    );
};
