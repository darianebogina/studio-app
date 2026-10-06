'use client';

import { Minus, Plus } from 'lucide-react';
import { ACTION_ICON_SIZE, NOT_IMPLEMENTED_MESSAGE } from './lib';
import styles from './styles.module.scss';

type StudentActionsProps = {
    userId: string;
    hasActiveSubscription: boolean;
};

// TODO: userId понадобится, когда заглушки заменят на server actions (шаги 6.4–6.6)
export const StudentActions = ({ hasActiveSubscription }: StudentActionsProps) => {
    const handleAddSubscription = () => window.alert(NOT_IMPLEMENTED_MESSAGE);
    const handleDeductLesson = () => window.alert(NOT_IMPLEMENTED_MESSAGE);
    const handleResetSubscription = () => window.alert(NOT_IMPLEMENTED_MESSAGE);

    return (
        <section className={styles.studentActions}>
            <div className={styles.grid}>
                <button
                    type="button"
                    onClick={handleAddSubscription}
                    className={styles.secondary}
                >
                    <Plus size={ACTION_ICON_SIZE} aria-hidden="true" />
                    Оформить
                </button>

                {hasActiveSubscription && (
                    <button
                        type="button"
                        onClick={handleDeductLesson}
                        className={styles.secondary}
                    >
                        <Minus size={ACTION_ICON_SIZE} aria-hidden="true" />
                        Списать
                    </button>
                )}
            </div>

            {hasActiveSubscription && (
                <button
                    type="button"
                    onClick={handleResetSubscription}
                    className={styles.danger}
                >
                    Аннулировать абонемент
                </button>
            )}
        </section>
    );
};
