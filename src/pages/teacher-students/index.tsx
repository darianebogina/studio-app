import { Suspense } from 'react';
import { Skeleton } from '@/shared/ui-kit';
import { TeacherStudentsContent } from './teacher-students-content';
import styles from './styles.module.scss';

export const TeacherStudentsPage = () => (
    <main className={styles.teacherStudentsPage}>
        <h1 className={styles.title}>Ученики</h1>

        <Suspense
            fallback={(
                <div className={styles.skeletons}>
                    <Skeleton height={44} borderRadius="var(--radius-md)" />

                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} height={60} />
                    ))}
                </div>
            )}
        >
            <TeacherStudentsContent />
        </Suspense>
    </main>
);
