import { Suspense } from 'react';
import { Skeleton } from '@/shared/ui-kit';
import { StudentBookingsContent } from './student-bookings-content';
import styles from './styles.module.scss';

export const StudentBookingsPage = () => (
    <Suspense
        fallback={(
            <main className={styles.skeletons}>
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
        <StudentBookingsContent />
    </Suspense>
);
