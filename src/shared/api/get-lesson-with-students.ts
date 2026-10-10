import type {
    Booking,
    BookingStatus,
    Lesson,
    LessonWithStudents,
    Subscription,
    UserProfile,
} from '@/shared/types';
import { createClient as createServerClient } from './supabase/server';

type LessonRow = Lesson & {
    bookings: (Booking & { user: UserProfile })[];
};

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ['booked', 'attended'];

// Фильтр по bookings.status отсекает только вложенные строки: занятие без записей всё равно вернётся.
// Абонементы грузим отдельным запросом: фильтр и сортировка на втором уровне вложенности ненадёжны.
// Активные абонементы идут от старого к новому — показываем первый, с него будет списание (FIFO).
export const getLessonWithStudents = async (lessonId: string): Promise<LessonWithStudents | null> => {
    const supabase = await createServerClient();

    const { data: lessonRow } = await supabase
        .from('lessons')
        .select('*, bookings(*, user:users(*))')
        .eq('id', lessonId)
        .in('bookings.status', ACTIVE_BOOKING_STATUSES)
        .order('booked_at', { referencedTable: 'bookings', ascending: true })
        .maybeSingle<LessonRow>();

    if (!lessonRow) return null;

    const { bookings, ...lesson } = lessonRow;
    const userIds = bookings.map(({ user_id: userId }) => userId);

    const { data: subscriptions } = userIds.length > 0
        ? await supabase
            .from('subscriptions')
            .select('*')
            .in('user_id', userIds)
            .eq('is_active', true)
            .order('purchased_at', { ascending: true })
            .overrideTypes<Subscription[], { merge: false }>()
        : { data: [] };

    return {
        lesson,
        bookings: bookings.map(({ user, ...booking }) => ({
            booking,
            user,
            activeSubscription: (subscriptions ?? []).find(({ user_id: userId }) => userId === user.id) ?? null,
        })),
    };
};
