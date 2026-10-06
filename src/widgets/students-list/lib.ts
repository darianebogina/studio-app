import type { StudentWithSubscription } from '@/shared/types';

export const SEARCH_ICON_SIZE = 16;

const toDigits = (value: string) => value.replace(/\D/g, '');

// Телефон сравниваем только по цифрам, чтобы «+7 (999)» и «7999» находили одно и то же
export const filterStudents = (students: StudentWithSubscription[], query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    const queryDigits = toDigits(normalizedQuery);

    if (!normalizedQuery) return students;

    return students.filter(({ user }) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const isPhoneMatch = queryDigits !== '' && toDigits(user.phone ?? '').includes(queryDigits);

        return fullName.includes(normalizedQuery) || isPhoneMatch;
    });
};
