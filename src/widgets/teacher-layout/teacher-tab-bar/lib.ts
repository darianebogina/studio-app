import { Calendar, Home, Users, type LucideIcon } from 'lucide-react';

export type Tab = {
    href: string;
    label: string;
    icon: LucideIcon;
};

export const ICON_SIZE = 20;

const ROOT_HREF = '/teacher';

export const TABS: Tab[] = [
    { href: '/teacher', label: 'Сегодня', icon: Home },
    { href: '/teacher/calendar', label: 'Календарь', icon: Calendar },
    { href: '/teacher/students', label: 'Ученики', icon: Users },
];

// Вложенные страницы (/teacher/students/[id]) подсвечивают родительский таб. Корневой таб сравниваем строго, иначе он активен везде.
export const isTabActive = (pathname: string, href: string) => (
    pathname === href || (href !== ROOT_HREF && pathname.startsWith(`${href}/`))
);
