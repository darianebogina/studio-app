'use server';

import { getLessonWithStudents, getUserRole } from '@/shared/api/server';

// Чтение через Server Action: в модалке клиентский компонент, а телефоны и почты учеников видит только преподаватель
export const loadLessonWithStudents = async (lessonId: string) => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return null;

    return getLessonWithStudents(lessonId);
};
