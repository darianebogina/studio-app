'use server';

import { revalidatePath } from 'next/cache';
import { isBefore, isValid, parseISO, subHours } from 'date-fns';
import { getUserRole } from '@/shared/api/server';
import { createClient as createServerClient } from '@/shared/api/supabase/server';
import type { Lesson, LessonType } from '@/shared/types';
import {
    CREATE_LESSON_PATHS,
    LESSON_TYPES,
    MAX_DURATION_MIN,
    MIN_DURATION_MIN,
    PAST_TOLERANCE_HOURS,
    type CreateLessonResult,
} from '../lib';

type CreateLessonParams = {
    type: LessonType;
    startsAt: string;
    durationMin: number;
    assignedStudentId?: string | null;
    externalStudentName?: string | null;
};

const isValidStartsAt = (startsAt: string) => {
    const date = parseISO(startsAt);

    return isValid(date) && !isBefore(date, subHours(new Date(), PAST_TOLERANCE_HOURS));
};

const isValidDuration = (durationMin: number) =>
    Number.isInteger(durationMin) && durationMin >= MIN_DURATION_MIN && durationMin <= MAX_DURATION_MIN;

export const createLesson = async ({
    type,
    startsAt,
    durationMin,
    assignedStudentId,
    externalStudentName,
}: CreateLessonParams): Promise<CreateLessonResult> => {
    const profile = await getUserRole();
    if (profile?.role !== 'teacher') return { ok: false, error: 'unauthorized' };

    if (!LESSON_TYPES.some(({ value }) => value === type)) return { ok: false, error: 'invalid_type' };
    if (!isValidStartsAt(startsAt)) return { ok: false, error: 'invalid_date' };
    if (!isValidDuration(durationMin)) return { ok: false, error: 'invalid_duration' };

    // Check-constraint в БД: у vogue ученика нет, у индива есть хотя бы один из двух
    const isIndividual = type === 'individual';
    const studentId = isIndividual ? assignedStudentId || null : null;
    const studentName = isIndividual ? externalStudentName?.trim() || null : null;

    if (isIndividual && !studentId && !studentName) return { ok: false, error: 'missing_student_for_indiv' };

    const supabase = await createServerClient();

    const { data, error } = await supabase
        .from('lessons')
        .insert({
            type,
            starts_at: parseISO(startsAt).toISOString(),
            duration_min: durationMin,
            status: 'scheduled',
            assigned_student_id: studentId,
            external_student_name: studentName,
        })
        .select('id')
        .single<Pick<Lesson, 'id'>>();

    if (error || !data) return { ok: false, error: 'unknown' };

    CREATE_LESSON_PATHS.forEach((path) => revalidatePath(path));

    return { ok: true, lessonId: data.id };
};
