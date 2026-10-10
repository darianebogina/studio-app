'use server';

import { getAllStudents, getUserRole } from '@/shared/api/server';

// Чтение через Server Action: в модалке клиентский компонент, а список учеников видит только преподаватель
export const loadStudents = async () => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return null;

    const students = await getAllStudents();

    return students.map(({ user }) => user);
};
