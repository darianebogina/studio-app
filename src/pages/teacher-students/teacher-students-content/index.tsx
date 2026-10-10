import { StudentsList } from '@/widgets/students-list';
import { getAllStudents } from '@/shared/api/server';

export const TeacherStudentsContent = async () => {
    const students = await getAllStudents();

    return <StudentsList students={students} />;
};
