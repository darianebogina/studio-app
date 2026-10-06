'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { PurchaseSubscriptionModal } from '@/features/purchase-subscription';
import { ACTION_ICON_SIZE, NOT_IMPLEMENTED_MESSAGE } from './lib';
import styles from './styles.module.scss';

type StudentActionsProps = {
    userId: string;
    userName: string;
    hasActiveSubscription: boolean;
};

export const StudentActions = ({ userId, userName, hasActiveSubscription }: StudentActionsProps) => {
    const [isOpenPurchase, setIsOpenPurchase] = useState(false);

    const handleOpenPurchase = () => setIsOpenPurchase(true);
    const handleClosePurchase = () => setIsOpenPurchase(false);
    const handleDeductLesson = () => window.alert(NOT_IMPLEMENTED_MESSAGE);
    const handleResetSubscription = () => window.alert(NOT_IMPLEMENTED_MESSAGE);

    return (
        <section className={styles.studentActions}>
            <div className={styles.grid}>
                <button
                    type="button"
                    onClick={handleOpenPurchase}
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

            <PurchaseSubscriptionModal
                isOpen={isOpenPurchase}
                onClose={handleClosePurchase}
                userId={userId}
                userName={userName}
            />
        </section>
    );
};
