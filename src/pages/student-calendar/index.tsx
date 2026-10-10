import { Suspense } from 'react';
import { Skeleton } from '@/shared/ui-kit';
import { StudentCalendarContent } from './student-calendar-content';
import styles from './styles.module.scss';

export const StudentCalendarPage = () => (
    <Suspense
        fallback={(
            <main className={styles.skeletons}>
                <Skeleton height={60} borderRadius="var(--radius-md)" />

                <div className={styles.lessons}>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            height={78}
                            borderRadius="var(--radius-md)"
                        />
                    ))}
                </div>
            </main>
        )}
    >
        <StudentCalendarContent />
    </Suspense>
);
