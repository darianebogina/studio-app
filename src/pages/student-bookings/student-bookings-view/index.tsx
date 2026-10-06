'use client';

import { useState } from 'react';
import { BookingsList } from '@/widgets/bookings-list';
import { CancelButton } from '@/features/cancel-booking';
import { LessonModal } from '@/entities/lesson';
import type { BookingWithLesson } from '@/shared/types';
import styles from './styles.module.scss';

type StudentBookingsViewProps = {
    bookings: BookingWithLesson[];
    currentUserId: string;
};

export const StudentBookingsView = ({ bookings, currentUserId }: StudentBookingsViewProps) => {
    const [selectedBooking, setSelectedBooking] = useState<BookingWithLesson | null>(null);

    const handleCloseBooking = () => setSelectedBooking(null);

    return (
        <main className={styles.studentBookingsView}>
            <BookingsList
                bookings={bookings}
                currentUserId={currentUserId}
                onSelectBooking={setSelectedBooking}
            />

            <LessonModal
                lesson={selectedBooking?.lesson ?? null}
                actions={selectedBooking && (
                    <CancelButton lessonId={selectedBooking.lesson_id} onSuccess={handleCloseBooking} />
                )}
                onClose={handleCloseBooking}
            />
        </main>
    );
};
