'use client';

import { formatDayLabel, formatDayNumber, getWeekDays, isSameDay } from '@/shared/lib/date';
import styles from './styles.module.scss';

type DayStripProps = {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
};

export const DayStrip = ({ selectedDate, onSelectDate }: DayStripProps) => {
    const weekDays = getWeekDays(selectedDate);
    const today = new Date();

    return (
        <div className={styles.dayStrip}>
            {weekDays.map((day) => {
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, today);

                return (
                    <button
                        key={day.toISOString()}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onSelectDate(day)}
                        className={`${styles.day} ${isSelected ? styles.selected : ''}`}
                    >
                        <span className={styles.label}>{formatDayLabel(day)}</span>
                        <span className={`${styles.number} ${isToday ? styles.today : ''}`}>
                            {formatDayNumber(day)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
