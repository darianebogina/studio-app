'use client';

import { useState } from 'react';
import { LedgerHistory } from '@/entities/ledger';
import { getMonthsSincePurchase, PLAN_LABELS, SubscriptionCard } from '@/entities/subscription';
import { pluralize } from '@/shared/lib/plural';
import type { LedgerEntry, Subscription } from '@/shared/types';
import { Modal } from '@/shared/ui-kit';
import styles from './styles.module.scss';

type SubscriptionBlockProps = {
    subscription: Subscription | null;
    ledgerEntries: LedgerEntry[];
};

export const SubscriptionBlock = ({ subscription, ledgerEntries }: SubscriptionBlockProps) => {
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

    const monthsSincePurchase = getMonthsSincePurchase(subscription.purchased_at);
    const isOverMonth = monthsSincePurchase >= 1;
    const passedVerb = pluralize(monthsSincePurchase, ['Прошёл', 'Прошло', 'Прошло']);
    const monthsWord = pluralize(monthsSincePurchase, ['месяц', 'месяца', 'месяцев']);
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
                        <p className={styles.warningTitle}>
                            {passedVerb} {monthsSincePurchase} {monthsWord} с покупки
                        </p>
                        <p className={styles.warningText}>Возможно, пора продлить</p>
                    </div>
                )}

                <div className={styles.detail}>
                    <span className={styles.detailLabel}>Дата покупки</span>
                    <span className={styles.detailValue}>{purchasedDate}</span>
                </div>

                <LedgerHistory entries={ledgerEntries} />
            </Modal>
        </section>
    );
};
