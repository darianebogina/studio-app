import { getTodayRange } from '@/shared/lib/date';
import { getLessonsByRangeWithBookings } from './get-lessons-by-range-with-bookings';

export const getTodayLessonsWithBookings = () => getLessonsByRangeWithBookings(getTodayRange());
