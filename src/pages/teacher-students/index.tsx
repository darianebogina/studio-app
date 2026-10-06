import { StudentsList } from '@/widgets/students-list';
import { getAllStudents } from '@/shared/api/server';
import styles from './styles.module.scss';

export const TeacherStudentsPage = async () => {
    const students = await getAllStudents();

    return (
        <main className={styles.teacherStudentsPage}>
            <h1 className={styles.title}>Ученики</h1>

            <StudentsList students={students} />
        </main>
    );
};
