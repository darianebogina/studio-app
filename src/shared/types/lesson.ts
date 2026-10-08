export type LessonType = 'vogue' | 'individual';
export type LessonStatus = 'scheduled' | 'cancelled';

export type Lesson = {
    id: string;
    type: LessonType;
    starts_at: string;
    duration_min: number;
    status: LessonStatus;
    assigned_student_id: string | null;
    external_student_name: string | null;
    created_at: string;
};

export type LessonWithBookings = {
    lesson: Lesson;
    bookedCount: number;
    studentName: string | null;
};
