import type { ReactNode } from 'react';
import { TeacherTabBar } from './teacher-tab-bar';
import styles from './styles.module.scss';

type TeacherLayoutProps = {
    children: ReactNode;
};

export const TeacherLayout = ({ children }: TeacherLayoutProps) => (
    <div className={styles.teacherLayout}>
        <div className={styles.content}>{children}</div>

        <TeacherTabBar />
    </div>
);
