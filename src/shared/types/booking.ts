import type { Lesson } from './lesson';
import type { Subscription } from './subscription';
import type { UserProfile } from './user';

export type BookingStatus = 'booked' | 'attended' | 'missed' | 'cancelled';

export type Booking = {
    id: string;
    lesson_id: string;
    user_id: string;
    status: BookingStatus;
    booked_at: string;
    attended_at: string | null;
};

export type BookingWithLesson = Booking & {
    lesson: Lesson;
};

export type BookingWithStudent = {
    booking: Booking;
    user: UserProfile;
    activeSubscription: Subscription | null;
};
