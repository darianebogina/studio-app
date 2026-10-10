import { getUserRole, getUserUpcomingBookings } from '@/shared/api/server';
import { StudentBookingsView } from '../student-bookings-view';

export const StudentBookingsContent = async () => {
    const user = await getUserRole();

    // proxy.ts уже редиректит неавторизованных на /login
    if (!user) return null;

    const bookings = await getUserUpcomingBookings(user.id);

    return <StudentBookingsView bookings={bookings} currentUserId={user.id} />;
};
