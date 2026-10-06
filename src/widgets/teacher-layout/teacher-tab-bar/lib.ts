import { Calendar, Home, Users, type LucideIcon } from 'lucide-react';

export type Tab = {
    href: string;
    label: string;
    icon: LucideIcon;
};

export const ICON_SIZE = 20;

export const TABS: Tab[] = [
    { href: '/teacher', label: 'Сегодня', icon: Home },
    { href: '/teacher/calendar', label: 'Календарь', icon: Calendar },
    { href: '/teacher/students', label: 'Ученики', icon: Users },
];
