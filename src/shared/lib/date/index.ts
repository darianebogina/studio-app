import { TZDate } from '@date-fns/tz';
import { addDays, format, isSameDay as isSameDate, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

const TIME_ZONE = 'Europe/Moscow';
const DAYS_IN_WEEK = 7;

const toStudioTime = (date: Date | string) => new TZDate(new Date(date), TIME_ZONE);

export const getWeekDays = (date: Date) => {
    const weekStart = startOfWeek(toStudioTime(date), { weekStartsOn: 1 });

    return Array.from({ length: DAYS_IN_WEEK }, (_, index) => addDays(weekStart, index));
};

export const formatDayLabel = (date: Date) => {
    const label = format(toStudioTime(date), 'EEEEEE', { locale: ru });

    return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
};

export const formatDayNumber = (date: Date) => format(toStudioTime(date), 'd');

export const formatLessonTime = (isoString: string) => format(toStudioTime(isoString), 'HH:mm');

export const isSameDay = (left: Date | string, right: Date | string) =>
    isSameDate(toStudioTime(left), toStudioTime(right));
