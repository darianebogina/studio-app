import { formatLessonDate, formatLessonTime } from '@/shared/lib/date';
import type { Lesson } from '@/shared/types';
import { LESSON_META_LABELS, LESSON_TITLES } from '../../model/types';
import { getLessonAccent, OWN_INDIV_META_LABEL, type LessonCardVariant } from './lib';
import styles from './styles.module.scss';

type LessonCardProps = {
    lesson: Lesson;
    isBooked?: boolean;
    showDate?: boolean;
    onClick?: () => void;
    variant?: LessonCardVariant;
};

export const LessonCard = ({
    lesson,
    isBooked = false,
    showDate = false,
    onClick,
    variant = 'default',
}: LessonCardProps) => {
    const { type, starts_at: startsAt, duration_min: durationMin, status } = lesson;

    const isCancelled = status === 'cancelled';
    const accent = getLessonAccent({ status, variant });
    const typeLabel = variant === 'own-indiv' ? OWN_INDIV_META_LABEL : LESSON_META_LABELS[type];
    const metaLabel = showDate ? `${formatLessonDate(startsAt)} · ${typeLabel}` : typeLabel;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${styles.lessonCard} ${isCancelled ? styles.cancelled : ''}`}
        >
            <span className={styles.time}>
                <span className={styles.startTime}>{formatLessonTime(startsAt)}</span>
                <span className={styles.duration}>{durationMin} мин</span>
            </span>

            <span className={`${styles.stripe} ${styles[accent]}`} />

            <span className={styles.info}>
                <span className={styles.title}>{LESSON_TITLES[type]}</span>
                <span className={styles.meta}>{metaLabel}</span>

                {isBooked && !isCancelled && (
                    <span className={styles.bookedBadge}>Вы записаны</span>
                )}

                {isCancelled && <span className={styles.cancelledBadge}>Занятие отменено</span>}
            </span>
        </button>
    );
};
