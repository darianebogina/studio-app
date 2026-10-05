import { Calendar, Home, Notebook, type LucideIcon } from 'lucide-react';

export type Tab = {
    href: string;
    label: string;
    icon: LucideIcon;
};

export const ICON_SIZE = 20;

export const TABS: Tab[] = [
    { href: '/home', label: 'Главная', icon: Home },
    { href: '/calendar', label: 'Календарь', icon: Calendar },
    { href: '/bookings', label: 'Записи', icon: Notebook },
];
