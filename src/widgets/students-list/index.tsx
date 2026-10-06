'use client';

import { useState, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { StudentListItem } from '@/entities/user';
import type { StudentWithSubscription } from '@/shared/types';
import { SEARCH_ICON_SIZE, filterStudents } from './lib';
import styles from './styles.module.scss';

type StudentsListProps = {
    students: StudentWithSubscription[];
};

export const StudentsList = ({ students }: StudentsListProps) => {
    const [query, setQuery] = useState('');

    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

    if (students.length === 0) {
        return <p className={styles.empty}>Пока нет учеников</p>;
    }

    const filteredStudents = filterStudents(students, query);

    return (
        <div className={styles.studentsList}>
            <label className={styles.search}>
                <Search
                    size={SEARCH_ICON_SIZE}
                    aria-hidden="true"
                    className={styles.searchIcon}
                />

                <input
                    type="search"
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Поиск по имени или телефону"
                    aria-label="Поиск по имени или телефону"
                    className={styles.searchInput}
                />
            </label>

            {filteredStudents.length === 0 && <p className={styles.empty}>Никого не найдено</p>}

            {filteredStudents.length > 0 && (
                <ul className={styles.list}>
                    {filteredStudents.map(({ user, subscription }) => (
                        <li key={user.id}>
                            <StudentListItem
                                user={user}
                                subscription={subscription}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
