import { Suspense } from 'react';
import { Skeleton } from '@/shared/ui-kit';
import { TeacherTodayContent } from './teacher-today-content';
import styles from './styles.module.scss';

export const TeacherTodayPage = () => (
    <Suspense
        fallback={(
            <main className={styles.skeletons}>
                <div className={styles.profile}>
                    <Skeleton variant="circular" height={64} />

                    <div className={styles.profileInfo}>
                        <Skeleton width="60%" height={24} />
                        <Skeleton width="40%" />
                    </div>
                </div>

                <div className={styles.stats}>
                    <Skeleton height={72} borderRadius="var(--radius-md)" />
                    <Skeleton height={72} borderRadius="var(--radius-md)" />
                </div>

                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        height={78}
                        borderRadius="var(--radius-md)"
                    />
                ))}
            </main>
        )}
    >
        <TeacherTodayContent />
    </Suspense>
);
