'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { Avatar } from '@/entities/user';
import type { UserProfile } from '@/shared/types';
import { addStudentToLesson } from '../../../api/add-student-to-lesson';
import { loadStudentsNotOnLesson } from '../../../api/load-students-not-on-lesson';
import {
    getAddStudentErrorMessage,
    getStudentFullName,
    SEARCH_ICON_SIZE,
    type AddStudentResult,
} from '../../../lib';
import styles from './styles.module.scss';

type StudentPickerProps = {
    lessonId: string;
    onAdded?: () => void;
};

const NETWORK_ERROR_RESULT: AddStudentResult = { ok: false, error: 'unknown' };

export const StudentPicker = ({ lessonId, onAdded }: StudentPickerProps) => {
    const [students, setStudents] = useState<UserProfile[] | null>(null);
    const [isLoadFailed, setIsLoadFailed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let isActual = true;

        loadStudentsNotOnLesson(lessonId)
            .catch(() => null)
            .then((loadedStudents) => {
                if (!isActual) return;

                setStudents(loadedStudents);
                setIsLoadFailed(!loadedStudents);
            });

        return () => {
            isActual = false;
        };
    }, [lessonId]);

    // Модалка остаётся открытой, чтобы можно было добавить ещё учеников
    const handleAdd = (userId: string) => {
        setErrorMessage('');

        startTransition(async () => {
            const result = await addStudentToLesson({ lessonId, userId }).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                setErrorMessage(getAddStudentErrorMessage(result.error));
                return;
            }

            setStudents((prev) => (prev ?? []).filter(({ id }) => id !== userId));
            onAdded?.();
        });
    };

    if (isLoadFailed) return <p className={styles.status}>Не удалось загрузить список учеников</p>;
    if (!students) return <p className={styles.status}>Загружаем...</p>;
    if (students.length === 0) return <p className={styles.status}>Все ученики уже записаны</p>;

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredStudents = students.filter(({ first_name: firstName, last_name: lastName }) =>
        getStudentFullName(firstName, lastName).toLowerCase().includes(normalizedQuery));

    return (
        <div className={styles.studentPicker}>
            <label className={styles.search}>
                <Search
                    size={SEARCH_ICON_SIZE}
                    aria-hidden="true"
                    className={styles.searchIcon}
                />

                <input
                    type="search"
                    placeholder="Поиск по имени"
                    aria-label="Поиск по имени"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className={styles.searchInput}
                />
            </label>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            {filteredStudents.length === 0 && <p className={styles.status}>Никого не найдено</p>}

            {filteredStudents.length > 0 && (
                <ul className={styles.students}>
                    {filteredStudents.map(({ id, first_name: firstName, last_name: lastName, phone }) => (
                        <li key={id}>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleAdd(id)}
                                className={styles.student}
                            >
                                <Avatar
                                    firstName={firstName}
                                    lastName={lastName}
                                    size="sm"
                                />

                                <span className={styles.info}>
                                    <span className={styles.name}>{getStudentFullName(firstName, lastName)}</span>

                                    {phone && <span className={styles.phone}>{phone}</span>}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
