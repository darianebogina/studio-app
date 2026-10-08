import { pluralize } from '@/shared/lib/plural';
import styles from './styles.module.scss';

type TodayStatsProps = {
    lessonsCount: number;
    bookedCount: number;
};

export const TodayStats = ({ lessonsCount, bookedCount }: TodayStatsProps) => (
    <div className={styles.todayStats}>
        <div className={styles.tile}>
            <span className={styles.value}>{lessonsCount}</span>
            <span className={styles.label}>
                {pluralize(lessonsCount, ['занятие сегодня', 'занятия сегодня', 'занятий сегодня'])}
            </span>
        </div>

        <div className={styles.tile}>
            <span className={styles.value}>{bookedCount}</span>
            <span className={styles.label}>
                {pluralize(bookedCount, ['записанный', 'записанных', 'записанных'])}
            </span>
        </div>
    </div>
);
