import type { LedgerEntry } from '@/shared/types';
import { DEDUCTION_UNIT_LABELS, PURCHASE_UNIT_LABELS, RESET_LABEL } from './model/types';

export type LedgerDeltaVariant = 'plus' | 'minus' | 'reset';

export type LedgerDelta = {
    text: string;
    variant: LedgerDeltaVariant;
};

// Настоящий минус U+2212, а не дефис: по ширине он совпадает с плюсом
const MINUS_SIGN = '−';

const formatSigned = (value: number) =>
    value < 0 ? `${MINUS_SIGN}${Math.abs(value)}` : `+${value}`;

export const formatLedgerDelta = ({
    event_type: eventType,
    lesson_kind: lessonKind,
    group_delta: groupDelta,
    individual_delta: individualDelta,
}: LedgerEntry): LedgerDelta => {
    if (eventType === 'reset') {
        return { text: RESET_LABEL, variant: 'reset' };
    }

    if (eventType === 'deduction') {
        const kind = lessonKind ?? (individualDelta !== 0 ? 'individual' : 'group');
        const delta = kind === 'individual' ? individualDelta : groupDelta;

        return {
            text: `${formatSigned(delta)} ${DEDUCTION_UNIT_LABELS[kind]}`,
            variant: 'minus',
        };
    }

    const text = [
        { kind: 'group' as const, delta: groupDelta },
        { kind: 'individual' as const, delta: individualDelta },
    ]
        .filter(({ delta }) => delta !== 0)
        .map(({ kind, delta }) => `${formatSigned(delta)} ${PURCHASE_UNIT_LABELS[kind]}`)
        .join(' · ');

    return { text, variant: 'plus' };
};
