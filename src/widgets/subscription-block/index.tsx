'use client';

import { useState } from 'react';
import { isSubscriptionOverMonth, PLAN_LABELS, SubscriptionCard, type Subscription } from '@/entities/subscription';
import { Modal } from '@/shared/ui-kit';
import styles from './styles.module.scss';

type SubscriptionBlockProps = {
    subscription: Subscription | null;
};

export const SubscriptionBlock = ({ subscription }: SubscriptionBlockProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    if (!subscription) {
        return (
            <section className={styles.subscriptionBlock}>
                <p className={styles.empty}>
                    Нет активного абонемента, обратитесь к преподавателю
                </p>
            </section>
        );
    }

    const isOverMonth = isSubscriptionOverMonth(subscription.purchased_at);
    const purchasedDate = new Date(subscription.purchased_at).toLocaleDateString('ru-RU');

    return (
        <section className={styles.subscriptionBlock}>
            <SubscriptionCard subscription={subscription} onClick={handleOpen} />

            <Modal
                isOpen={isModalOpen}
                title={PLAN_LABELS[subscription.plan]}
                onClose={handleClose}
            >
                {isOverMonth && (
                    <div className={styles.warning}>
                        <p className={styles.warningTitle}>Прошёл месяц с покупки</p>
                        <p className={styles.warningText}>Возможно, пора продлить</p>
                    </div>
                )}

                <div className={styles.detail}>
                    <span className={styles.detailLabel}>Дата покупки</span>
                    <span className={styles.detailValue}>{purchasedDate}</span>
                </div>
            </Modal>
        </section>
    );
};
