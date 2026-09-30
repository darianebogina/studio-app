export type LedgerEventType = 'purchase' | 'deduction' | 'reset';
export type LessonKind = 'group' | 'individual';

export type LedgerEntry = {
    id: string;
    user_id: string;
    event_type: LedgerEventType;
    lesson_kind: LessonKind | null;
    group_delta: number;
    individual_delta: number;
    subscription_id: string | null;
    lesson_id: string | null;
    note: string;
    created_at: string;
};