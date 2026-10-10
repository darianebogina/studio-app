'use client';

import { useEffect, useState, useTransition } from 'react';
import { CancelLessonButton } from '@/features/cancel-lesson-teacher';
import { getMarkAttendanceErrorMessage, markAttendance, type MarkAttendanceResult } from '@/features/mark-attendance';
import type { BookingWithStudent, Lesson } from '@/shared/types';
import { loadLessonWithStudents } from '../api/load-lesson-with-students';
import { getAttendedBookingIds, getSubscriptionBalance, isSameIds, NO_SUBSCRIPTION_LABEL } from '../lib';
import styles from './styles.module.scss';

type LessonAttendanceProps = {
    lesson: Lesson;
    onClose: () => void;
};

const NETWORK_ERROR_RESULT: MarkAttendanceResult = { ok: false, error: 'unknown' };

const fetchBookings = (lessonId: string) =>
    loadLessonWithStudents(lessonId)
        .then((data) => data?.bookings ?? null)
        .catch(() => null);

export const LessonAttendance = ({ lesson, onClose }: LessonAttendanceProps) => {
    const [bookings, setBookings] = useState<BookingWithStudent[] | null>(null);
    const [isLoadFailed, setIsLoadFailed] = useState(false);
    const [attendedBookingIds, setAttendedBookingIds] = useState<Set<string>>(() => new Set());
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let isActual = true;

        fetchBookings(lesson.id).then((loadedBookings) => {
            if (!isActual) return;

            setBookings(loadedBookings);
            setAttendedBookingIds(getAttendedBookingIds(loadedBookings ?? []));
            setIsLoadFailed(!loadedBookings);
        });

        return () => {
            isActual = false;
        };
    }, [lesson.id]);

    const handleToggle = (bookingId: string) => setAttendedBookingIds((prev) => (
        prev.has(bookingId)
            ? new Set([...prev].filter((id) => id !== bookingId))
            : new Set([...prev, bookingId])
    ));

    // Отправляем состояние всех чекбоксов: что отметить, а что откатить, сервер решает по статусам из БД
    const handleSave = () => {
        const attendances = (bookings ?? []).map(({ booking, user }) => ({
            bookingId: booking.id,
            userId: user.id,
            markedAttended: attendedBookingIds.has(booking.id),
        }));

        setErrorMessage('');

        startTransition(async () => {
            const result = await markAttendance({ lessonId: lesson.id, attendances })
                .catch(() => NETWORK_ERROR_RESULT);

            if (result.ok) {
                onClose();
                return;
            }

            setErrorMessage(getMarkAttendanceErrorMessage(result.error));

            // Часть изменений могла сохраниться: перечитываем список, чтобы подсветка осталась только на несохранённых.
            // Выбор преподавателя не сбрасываем, чтобы можно было повторить сохранение
            const freshBookings = await fetchBookings(lesson.id);
            if (freshBookings) setBookings(freshBookings);
        });
    };

    if (isLoadFailed) return <p className={styles.status}>Не удалось загрузить список учеников</p>;
    if (!bookings) return <p className={styles.status}>Загружаем...</p>;

    // Исходное состояние — статусы из БД: при открытии модалки и после перечитывания списка
    const initialAttendedIds = getAttendedBookingIds(bookings);
    const hasChanges = !isSameIds(initialAttendedIds, attendedBookingIds);

    return (
        <div className={styles.lessonAttendance}>
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Записаны ({bookings.length})</h3>

                {bookings.length === 0 && <p className={styles.empty}>Никто не записан</p>}

                {bookings.length > 0 && (
                    <ul className={styles.students}>
                        {bookings.map(({ booking, user, activeSubscription }) => {
                            const isChecked = attendedBookingIds.has(booking.id);
                            const isChanged = isChecked !== initialAttendedIds.has(booking.id);
                            const balance = activeSubscription && getSubscriptionBalance(activeSubscription, lesson.type);
                            const isBalanceEmpty = !balance || balance.remaining === 0;

                            return (
                                <li key={booking.id} className={`${styles.student} ${isChanged ? styles.studentChanged : ''}`}>
                                    <label className={styles.studentLabel}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            disabled={isPending}
                                            onChange={() => handleToggle(booking.id)}
                                            className={styles.checkbox}
                                        />
                                        <span className={styles.name}>{user.first_name} {user.last_name}</span>
                                    </label>

                                    <span className={`${styles.balance} ${isBalanceEmpty ? styles.balanceEmpty : ''}`}>
                                        {balance ? `${balance.remaining}/${balance.total}` : NO_SUBSCRIPTION_LABEL}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <div className={styles.actions}>
                <button
                    type="button"
                    disabled={!hasChanges || isPending}
                    onClick={handleSave}
                    className={styles.save}
                >
                    {isPending ? 'Сохраняем...' : 'Сохранить'}
                </button>

                {errorMessage && <p className={styles.error}>{errorMessage}</p>}

                <CancelLessonButton lessonId={lesson.id} onSuccess={onClose} />
            </div>
        </div>
    );
};
