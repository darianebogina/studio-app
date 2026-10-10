'use client';

import { useState, useTransition } from 'react';
import { formatInputDate, getTodayDate, toUtcIsoString } from '@/shared/lib/date';
import type { FormStatus, LessonType, UserProfile } from '@/shared/types';
import { toast } from '@/shared/ui-kit';
import { createLesson } from '../../../api/create-lesson';
import { loadStudents } from '../../../api/load-students';
import {
    DURATION_STEP_MIN,
    getCreateLessonErrorMessage,
    LESSON_TYPES,
    MAX_DURATION_MIN,
    MIN_DURATION_MIN,
} from '../../../lib';
import {
    DEFAULT_DURATION_MIN,
    DEFAULT_TIME,
    DEFAULT_TYPE,
    getStudentFullName,
    NETWORK_ERROR_RESULT,
} from './lib';
import styles from './styles.module.scss';

type CreateLessonFormProps = {
    defaultDate?: Date;
    onCreated: () => void;
};

export const CreateLessonForm = ({ defaultDate, onCreated }: CreateLessonFormProps) => {
    const [type, setType] = useState<LessonType>(DEFAULT_TYPE);
    const [date, setDate] = useState(() => (defaultDate ? formatInputDate(defaultDate) : getTodayDate()));
    const [time, setTime] = useState(DEFAULT_TIME);
    // Строкой, а не числом: иначе очищенное поле сразу превращается в 0 и его нельзя стереть
    const [durationMin, setDurationMin] = useState(DEFAULT_DURATION_MIN);
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [studentsStatus, setStudentsStatus] = useState<FormStatus>('idle');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [externalName, setExternalName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    // Список учеников нужен только индиву, поэтому грузим его при первом выборе этого типа
    const handleSelectType = (value: LessonType) => {
        setType(value);

        const shouldLoadStudents = value === 'individual'
            && (studentsStatus === 'idle' || studentsStatus === 'error');
        if (!shouldLoadStudents) return;

        setStudentsStatus('loading');

        loadStudents()
            .catch(() => null)
            .then((loadedStudents) => {
                if (!loadedStudents) {
                    setStudentsStatus('error');
                    return;
                }

                setStudents(loadedStudents);
                setStudentsStatus('success');
            });
    };

    const handleSubmit = () => {
        setErrorMessage('');

        const isIndividual = type === 'individual';

        startTransition(async () => {
            const result = await createLesson({
                type,
                startsAt: toUtcIsoString(date, time),
                durationMin: Number(durationMin),
                assignedStudentId: isIndividual ? selectedStudentId : null,
                externalStudentName: isIndividual ? externalName.trim() || null : null,
            }).catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                const message = getCreateLessonErrorMessage(result.error);
                setErrorMessage(message);
                toast.error(message);
                return;
            }

            toast.success('Занятие создано');
            onCreated();
        });
    };

    const isIndividual = type === 'individual';
    const isStudentMissing = isIndividual && !selectedStudentId && !externalName.trim();
    const isSubmitDisabled = !date || !time || isPending || isStudentMissing;

    return (
        <div className={styles.createLessonForm}>
            <fieldset className={styles.section}>
                <legend className={styles.label}>Тип занятия</legend>

                <div className={styles.types}>
                    {LESSON_TYPES.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={value === type}
                            onClick={() => handleSelectType(value)}
                            className={`${styles.type} ${value === type ? styles.selected : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </fieldset>

            <div className={styles.fields}>
                <label className={styles.field}>
                    <span className={styles.fieldLabel}>Дата</span>

                    <input
                        type="date"
                        value={date}
                        min={getTodayDate()}
                        required
                        onChange={(event) => setDate(event.target.value)}
                        className={styles.input}
                    />
                </label>

                <label className={styles.field}>
                    <span className={styles.fieldLabel}>Время</span>

                    <input
                        type="time"
                        value={time}
                        required
                        onChange={(event) => setTime(event.target.value)}
                        className={styles.input}
                    />
                </label>

                <label className={styles.field}>
                    <span className={styles.fieldLabel}>Длительность (мин)</span>

                    <input
                        type="number"
                        inputMode="numeric"
                        value={durationMin}
                        min={MIN_DURATION_MIN}
                        max={MAX_DURATION_MIN}
                        step={DURATION_STEP_MIN}
                        required
                        onChange={(event) => setDurationMin(event.target.value)}
                        className={styles.input}
                    />
                </label>
            </div>

            {isIndividual && (
                <fieldset className={styles.section}>
                    <legend className={styles.label}>Ученик</legend>

                    <select
                        value={selectedStudentId ?? ''}
                        disabled={studentsStatus !== 'success'}
                        aria-label="Ученик из базы"
                        onChange={(event) => setSelectedStudentId(event.target.value || null)}
                        className={styles.select}
                    >
                        <option value="">
                            {studentsStatus === 'loading' ? 'Загружаем...' : '— выберите из базы —'}
                        </option>

                        {students.map(({ id, first_name: firstName, last_name: lastName }) => (
                            <option key={id} value={id}>{getStudentFullName(lastName, firstName)}</option>
                        ))}
                    </select>

                    {studentsStatus === 'error' && (
                        <p className={styles.error}>Не удалось загрузить список учеников</p>
                    )}

                    <p className={styles.divider}>или</p>

                    <input
                        type="text"
                        value={externalName}
                        placeholder="Имя внешнего ученика"
                        aria-label="Имя внешнего ученика"
                        onChange={(event) => setExternalName(event.target.value)}
                        className={styles.input}
                    />
                </fieldset>
            )}

            <button
                type="button"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
                className={styles.submit}
            >
                {isPending ? 'Создаём...' : 'Создать'}
            </button>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
    );
};
