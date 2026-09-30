import type { ReactNode } from 'react';

import { StudentTabBar } from '@/widgets/student-tab-bar';

import styles from './styles.module.scss';

type StudentLayoutProps = {
    children: ReactNode;
};

export const StudentLayout = ({ children }: StudentLayoutProps) => (
    <div className={styles.studentLayout}>
        <div className={styles.content}>{children}</div>

        <StudentTabBar />
    </div>
);
