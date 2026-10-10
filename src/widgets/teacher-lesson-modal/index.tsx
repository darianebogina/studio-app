'use client';

import { useState } from 'react';
import { AddStudentModal } from '@/features/add-student-to-lesson';
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
    const [isOpenAddStudent, setIsOpenAddStudent] = useState(false);
    const [bookingsReloadKey, setBookingsReloadKey] = useState(0);

    const handleClose = () => {
        setIsOpenAddStudent(false);
        setBookingsReloadKey(0);
        onClose();
    };

    const reloadBookings = () => setBookingsReloadKey((prev) => prev + 1);

    if (!lesson) return null;

    const { type, starts_at: startsAt, duration_min: durationMin, status } = lesson;
    const isCancelled = status === 'cancelled';

    // AddStudentModal рендерится рядом, а не внутри Modal: cancel и close у <dialog> всплывают по дереву React,
    // и закрытие вложенной модалки закрыло бы и модалку занятия
    return (
        <>
            <Modal
                isOpen
                title={`${LESSON_TITLES[type]} · ${formatLessonTime(startsAt)}`}
                titleAddon={<span className={`${styles.badge} ${styles[type]}`}>{LESSON_META_LABELS[type]}</span>}
                onClose={handleClose}
            >
                <p className={styles.meta}>
                    {formatFullDate(startsAt)} · {formatDuration(durationMin)}
                </p>

                {isCancelled && <p className={styles.cancelled}>Занятие отменено</p>}

                {!isCancelled && (
                    <LessonAttendance
                        key={lesson.id}
                        lesson={lesson}
                        reloadKey={bookingsReloadKey}
                        onAddStudent={() => setIsOpenAddStudent(true)}
                        onClose={handleClose}
                    />
                )}
            </Modal>

            {!isCancelled && (
                <AddStudentModal
                    isOpen={isOpenAddStudent}
                    lessonId={lesson.id}
                    onClose={() => setIsOpenAddStudent(false)}
                    onAdded={reloadBookings}
                />
            )}
        </>
    );
};
