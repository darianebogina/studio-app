import { formatFullDate, formatLessonTime } from '@/shared/lib/date';
import type { Lesson } from '@/shared/types';
import { Modal } from '@/shared/ui-kit';
import { LESSON_META_LABELS, LESSON_TITLES } from '../../model/types';
import { DEDUCTION_HINTS, formatDuration } from './lib';
import styles from './styles.module.scss';

type LessonModalProps = {
    lesson: Lesson | null;
    isBooked: boolean;
    onClose: () => void;
    onBook?: () => void;
    onCancel?: () => void;
};

export const LessonModal = ({
    lesson,
    isBooked,
    onClose,
    onBook,
    onCancel,
}: LessonModalProps) => {
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
                    {isBooked ? (
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.cancelButton}
                        >
                            Отменить запись
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onBook}
                            className={styles.bookButton}
                        >
                            Записаться
                        </button>
                    )}

                    <p className={styles.hint}>{DEDUCTION_HINTS[type]}</p>
                </div>
            )}
        </Modal>
    );
};
