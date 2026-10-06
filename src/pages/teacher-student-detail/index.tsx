import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { StudentActions } from '@/widgets/student-actions';
import { StudentDetailHeader } from '@/widgets/student-detail-header';
import { StudentHistory } from '@/widgets/student-history';
import { SubscriptionCard } from '@/entities/subscription';
import { getActiveSubscription, getLedgerEntries, getStudentById } from '@/shared/api/server';
import { BACK_ICON_SIZE } from './lib';
import styles from './styles.module.scss';

type TeacherStudentDetailPageProps = {
    params: Promise<{ id: string }>;
};

export const TeacherStudentDetailPage = async ({ params }: TeacherStudentDetailPageProps) => {
    const { id } = await params;
    const student = await getStudentById(id);

    if (!student) {
        notFound();
    }

    const [subscription, ledgerEntries] = await Promise.all([
        getActiveSubscription(id),
        getLedgerEntries(id),
    ]);

    return (
        <main className={styles.teacherStudentDetailPage}>
            <Link
                href="/teacher/students"
                aria-label="Назад к списку учеников"
                className={styles.back}
            >
                <ChevronLeft size={BACK_ICON_SIZE} aria-hidden="true" />
            </Link>

            <StudentDetailHeader user={student} />

            {subscription && <SubscriptionCard subscription={subscription} />}

            {!subscription && <p className={styles.empty}>Нет активного абонемента</p>}

            <StudentActions
                userId={student.id}
                hasActiveSubscription={subscription !== null}
            />

            <StudentHistory entries={ledgerEntries} />
        </main>
    );
};
