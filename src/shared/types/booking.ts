export type BookingStatus = 'booked' | 'attended' | 'missed' | 'cancelled';

export type Booking = {
    id: string;
    lesson_id: string;
    user_id: string;
    status: BookingStatus;
    booked_at: string;
    attended_at: string | null;
};
