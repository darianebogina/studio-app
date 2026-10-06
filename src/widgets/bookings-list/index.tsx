import { LessonCard } from '@/entities/lesson';
import type { BookingWithLesson } from '@/shared/types';
import styles from './styles.module.scss';

type BookingsListProps = {
    bookings: BookingWithLesson[];
    currentUserId: string;
    onSelectBooking: (booking: BookingWithLesson) => void;
};

export const BookingsList = ({ bookings, currentUserId, onSelectBooking }: BookingsListProps) => {
    if (bookings.length === 0) {
        return <p className={styles.empty}>Нет записей на занятия</p>;
    }

    return (
        <ul className={styles.bookingsList}>
            {bookings.map((booking) => {
                const { lesson } = booking;
                const isOwnIndiv =
                    lesson.type === 'individual' && lesson.assigned_student_id === currentUserId;

                return (
                    <li key={booking.id}>
                        <LessonCard
                            lesson={lesson}
                            isBooked
                            showDate
                            variant={isOwnIndiv ? 'own-indiv' : 'default'}
                            onClick={() => onSelectBooking(booking)}
                        />
                    </li>
                );
            })}
        </ul>
    );
};
