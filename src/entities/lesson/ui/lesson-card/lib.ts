import type { LessonStatus, LessonType } from '@/shared/types';

export type LessonCardVariant = 'default' | 'own-indiv';

export type LessonAccent = 'group' | 'ownIndiv' | 'muted';

type GetLessonAccentParams = {
    status: LessonStatus;
    variant: LessonCardVariant;
};

export const LESSON_TITLES: Record<LessonType, string> = {
    vogue: 'Vogue',
    individual: 'Индивидуальное',
};

export const LESSON_META_LABELS: Record<LessonType, string> = {
    vogue: 'Групповое',
    individual: 'Индив',
};

export const OWN_INDIV_META_LABEL = 'Ваш индив';

export const getLessonAccent = ({ status, variant }: GetLessonAccentParams): LessonAccent => {
    if (status === 'cancelled') return 'muted';

    return variant === 'own-indiv' ? 'ownIndiv' : 'group';
};
