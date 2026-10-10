import { Suspense } from 'react';
import { LogoutButton } from '@/features/auth';
import { Skeleton } from '@/shared/ui-kit';
import { StudentHomeContent } from './student-home-content';
import styles from './styles.module.scss';

export const StudentHomePage = () => (
    <main className={styles.studentHomePage}>
        <Suspense
            fallback={(
                <>
                    <div className={styles.profile}>
                        <Skeleton variant="circular" height={64} />

                        <div className={styles.profileInfo}>
                            <Skeleton width="60%" height={24} />
                            <Skeleton width="40%" />
                        </div>
                    </div>

                    <Skeleton height={128} borderRadius="var(--radius-md)" />
                </>
            )}
        >
            <StudentHomeContent />
        </Suspense>

        <div className={styles.logout}>
            <LogoutButton />
        </div>
    </main>
);
