'use client';

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { DeductLessonModal } from '@/features/deduct-lesson-manually';
import { PurchaseSubscriptionModal } from '@/features/purchase-subscription';
import { ResetSubscriptionButton } from '@/features/reset-subscription';
import { ACTION_ICON_SIZE } from './lib';
import styles from './styles.module.scss';

type StudentActionsProps = {
    userId: string;
    userName: string;
    hasActiveSubscription: boolean;
};

export const StudentActions = ({ userId, userName, hasActiveSubscription }: StudentActionsProps) => {
    const [isOpenPurchase, setIsOpenPurchase] = useState(false);
    const [isOpenDeduct, setIsOpenDeduct] = useState(false);

    const handleOpenPurchase = () => setIsOpenPurchase(true);
    const handleClosePurchase = () => setIsOpenPurchase(false);
    const handleOpenDeduct = () => setIsOpenDeduct(true);
    const handleCloseDeduct = () => setIsOpenDeduct(false);

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
                        onClick={handleOpenDeduct}
                        className={styles.secondary}
                    >
                        <Minus size={ACTION_ICON_SIZE} aria-hidden="true" />
                        Списать
                    </button>
                )}
            </div>

            {hasActiveSubscription && (
                <ResetSubscriptionButton
                    userId={userId}
                    disabled={!hasActiveSubscription}
                />
            )}

            <PurchaseSubscriptionModal
                isOpen={isOpenPurchase}
                onClose={handleClosePurchase}
                userId={userId}
                userName={userName}
            />

            <DeductLessonModal
                isOpen={isOpenDeduct}
                onClose={handleCloseDeduct}
                userId={userId}
                userName={userName}
            />
        </section>
    );
};
