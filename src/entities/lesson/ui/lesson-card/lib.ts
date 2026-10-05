import type { LessonStatus } from '@/shared/types';

export type LessonCardVariant = 'default' | 'own-indiv';

export type LessonAccent = 'group' | 'ownIndiv' | 'muted';

type GetLessonAccentParams = {
    status: LessonStatus;
    variant: LessonCardVariant;
};

export const OWN_INDIV_META_LABEL = 'Ваш индив';

export const getLessonAccent = ({ status, variant }: GetLessonAccentParams): LessonAccent => {
    if (status === 'cancelled') return 'muted';

    return variant === 'own-indiv' ? 'ownIndiv' : 'group';
};
