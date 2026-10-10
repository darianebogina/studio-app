import { formatDuration, LESSON_META_LABELS, LESSON_TITLES } from '@/entities/lesson';
import { formatFullDate, formatLessonTime } from '@/shared/lib/date';
import type { Lesson } from '@/shared/types';
import { Modal } from '@/shared/ui-kit';
import { LessonAttendance } from './lesson-attendance';
import styles from './styles.module.scss';

type TeacherLessonModalProps = {
    lesson: Lesson | null;
    onClose: () => void;
};

// Модалка размонтируется при закрытии, поэтому отметки и загруженный список сбрасываются сами
export const TeacherLessonModal = ({ lesson, onClose }: TeacherLessonModalProps) => {
    if (!lesson) return null;

    const { type, starts_at: startsAt, duration_min: durationMin, status } = lesson;
    const isCancelled = status === 'cancelled';

    return (
        <Modal
            isOpen
            title={`${LESSON_TITLES[type]} · ${formatLessonTime(startsAt)}`}
            titleAddon={<span className={`${styles.badge} ${styles[type]}`}>{LESSON_META_LABELS[type]}</span>}
            onClose={onClose}
        >
            <p className={styles.meta}>
                {formatFullDate(startsAt)} · {formatDuration(durationMin)}
            </p>

            {isCancelled && <p className={styles.cancelled}>Занятие отменено</p>}

            {!isCancelled && (
                <LessonAttendance
                    key={lesson.id}
                    lesson={lesson}
                    onClose={onClose}
                />
            )}
        </Modal>
    );
};
