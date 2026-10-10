import { pluralize } from '@/shared/lib/plural';
import type { LessonStatus, LessonType } from '@/shared/types';
import { LESSON_META_LABELS } from '../../model/types';

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

type GetMetaLabelParams = {
    type: LessonType;
    variant: LessonCardVariant;
    bookedCount?: number;
    studentName?: string | null;
};

export const getMetaLabel = ({ type, variant, bookedCount, studentName }: GetMetaLabelParams) => {
    if (variant === 'own-indiv') return OWN_INDIV_META_LABEL;

    if (type === 'individual') {
        return studentName ? `${LESSON_META_LABELS[type]} · ${studentName}` : LESSON_META_LABELS[type];
    }

    if (bookedCount !== undefined) {
        return `${bookedCount} ${pluralize(bookedCount, ['ученик', 'ученика', 'учеников'])}`;
    }

    return LESSON_META_LABELS[type];
};
