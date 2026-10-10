'use server';

import { getStudentsNotOnLesson, getUserRole } from '@/shared/api/server';

// Чтение через Server Action: в модалке клиентский компонент, а телефоны учеников видит только преподаватель
export const loadStudentsNotOnLesson = async (lessonId: string) => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return null;

    return getStudentsNotOnLesson(lessonId);
};
