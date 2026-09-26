export type UserRole = 'student' | 'teacher';

export type UserProfile = {
    id: string;
    email: string;
    phone: string | null;
    first_name: string;
    last_name: string;
    role: UserRole;
    created_at: string;
};
