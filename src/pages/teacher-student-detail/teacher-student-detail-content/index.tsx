import { notFound } from 'next/navigation';
import { StudentActions } from '@/widgets/student-actions';
import { StudentDetailHeader } from '@/widgets/student-detail-header';
import { StudentHistory } from '@/widgets/student-history';
import { SubscriptionCard } from '@/entities/subscription';
import { getActiveSubscription, getLedgerEntries, getStudentById } from '@/shared/api/server';
import styles from './styles.module.scss';

type TeacherStudentDetailContentProps = {
    id: string;
};

export const TeacherStudentDetailContent = async ({ id }: TeacherStudentDetailContentProps) => {
    const student = await getStudentById(id);

    if (!student) {
        notFound();
    }

    const [subscription, ledgerEntries] = await Promise.all([
        getActiveSubscription(id),
        getLedgerEntries(id),
    ]);

    return (
        <>
            <StudentDetailHeader user={student} />

            {subscription && <SubscriptionCard subscription={subscription} />}

            {!subscription && <p className={styles.empty}>Нет активного абонемента</p>}

            <StudentActions
                userId={student.id}
                userName={`${student.first_name} ${student.last_name}`}
                hasActiveSubscription={subscription !== null}
            />

            <StudentHistory entries={ledgerEntries} />
        </>
    );
};
