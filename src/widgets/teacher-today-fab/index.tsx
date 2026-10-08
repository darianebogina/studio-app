'use client';

import { Plus } from 'lucide-react';
import { FAB_ICON_SIZE } from './lib';
import styles from './styles.module.scss';

type TeacherTodayFabProps = {
    onClick: () => void;
};

export const TeacherTodayFab = ({ onClick }: TeacherTodayFabProps) => (
    <button
        type="button"
        onClick={onClick}
        aria-label="Создать занятие"
        className={styles.teacherTodayFab}
    >
        <Plus size={FAB_ICON_SIZE} aria-hidden="true" />
    </button>
);
