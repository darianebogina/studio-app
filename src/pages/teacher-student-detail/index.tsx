import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/shared/ui-kit';
import { BACK_ICON_SIZE } from './lib';
import { TeacherStudentDetailContent } from './teacher-student-detail-content';
import styles from './styles.module.scss';

type TeacherStudentDetailPageProps = {
    params: Promise<{ id: string }>;
};

export const TeacherStudentDetailPage = async ({ params }: TeacherStudentDetailPageProps) => {
    const { id } = await params;

    return (
        <main className={styles.teacherStudentDetailPage}>
            <Link
                href="/teacher/students"
                aria-label="Назад к списку учеников"
                className={styles.back}
            >
                <ChevronLeft size={BACK_ICON_SIZE} aria-hidden="true" />
            </Link>

            <Suspense
                fallback={(
                    <>
                        <div className={styles.profile}>
                            <Skeleton variant="circular" height={64} />

                            <div className={styles.profileInfo}>
                                <Skeleton width="45%" height={20} />
                                <Skeleton width="65%" height={12} />
                            </div>
                        </div>

                        <Skeleton height={128} borderRadius="var(--radius-md)" />

                        <Skeleton height={44} borderRadius="var(--radius-md)" />

                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} height={44} />
                        ))}
                    </>
                )}
            >
                <TeacherStudentDetailContent id={id} />
            </Suspense>
        </main>
    );
};
