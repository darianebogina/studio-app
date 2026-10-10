import { TZDate } from '@date-fns/tz';
import { addDays, format, isSameDay as isSameDate, startOfDay, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

const TIME_ZONE = 'Europe/Moscow';
const DAYS_IN_WEEK = 7;

const toStudioTime = (date: Date | string) => new TZDate(new Date(date), TIME_ZONE);

const capitalize = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export const getWeekDays = (date: Date) => {
    const weekStart = startOfWeek(toStudioTime(date), { weekStartsOn: 1 });

    return Array.from({ length: DAYS_IN_WEEK }, (_, index) => addDays(weekStart, index));
};

export const formatDayLabel = (date: Date) =>
    capitalize(format(toStudioTime(date), 'EEEEEE', { locale: ru }));

export const formatDayNumber = (date: Date) => format(toStudioTime(date), 'd');

export const formatLessonTime = (isoString: string) => format(toStudioTime(isoString), 'HH:mm');

export const formatFullDate = (isoString: string) =>
    capitalize(format(toStudioTime(isoString), 'EEEE, d MMMM', { locale: ru }));

export const isSameDay = (left: Date | string, right: Date | string) =>
    isSameDate(toStudioTime(left), toStudioTime(right));

export const formatLessonDate = (isoString: string) =>
    capitalize(format(toStudioTime(isoString), 'EEEEEE, d MMMM', { locale: ru }));

export const formatShortDate = (isoString: string) => format(toStudioTime(isoString), 'dd.MM.yyyy');

export const getTodayDate = () => format(toStudioTime(new Date()), 'yyyy-MM-dd');

export const getTodayRange = () => {
    const dateFrom = startOfDay(toStudioTime(new Date()));

    return { dateFrom, dateTo: addDays(dateFrom, 1) };
};

export const formatInputDate = (date: Date) => format(toStudioTime(date), 'yyyy-MM-dd');

// Дата и время из полей формы — время студии. TZDate.toISOString() отдаёт смещение +03:00,
// поэтому для БД пересобираем обычный Date и получаем UTC с Z
export const toUtcIsoString = (date: string, time: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const studioDate = new TZDate(year, month - 1, day, hours, minutes, TIME_ZONE);

    return new Date(studioDate.getTime()).toISOString();
};
