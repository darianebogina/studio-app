import { pluralize } from '@/shared/lib/plural';
import styles from './styles.module.scss';

type TodayStatsProps = {
    lessonsCount: number;
    studentsCount: number;
};

export const TodayStats = ({ lessonsCount, studentsCount }: TodayStatsProps) => (
    <div className={styles.todayStats}>
        <div className={styles.tile}>
            <span className={styles.value}>{lessonsCount}</span>
            <span className={styles.label}>
                {pluralize(lessonsCount, ['занятие сегодня', 'занятия сегодня', 'занятий сегодня'])}
            </span>
        </div>

        <div className={styles.tile}>
            <span className={styles.value}>{studentsCount}</span>
            <span className={styles.label}>
                {pluralize(studentsCount, ['ученик всего', 'ученика всего', 'учеников всего'])}
            </span>
        </div>
    </div>
);
