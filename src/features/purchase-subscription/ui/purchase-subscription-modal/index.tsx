'use client';

import { useState, useTransition } from 'react';
import { PLAN_LABELS, PLANS } from '@/entities/subscription';
import { getTodayDate } from '@/shared/lib/date';
import type { SubscriptionPlan } from '@/shared/types';
import { Modal } from '@/shared/ui-kit';
import { purchaseSubscription } from '../../api/purchase-subscription';
import { getPurchaseErrorMessage } from '../../lib';
import { DEFAULT_PLAN, formatPrice, getSubmitLabel, NETWORK_ERROR_RESULT } from './lib';
import styles from './styles.module.scss';

type PurchaseSubscriptionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
};

export const PurchaseSubscriptionModal = ({
    isOpen,
    onClose,
    userId,
    userName,
}: PurchaseSubscriptionModalProps) => {
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(DEFAULT_PLAN);
    const [purchasedAt, setPurchasedAt] = useState(getTodayDate);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPending, startTransition] = useTransition();

    // Модалка остаётся смонтированной, поэтому форму сбрасываем сами: иначе при следующем
    // открытии останутся прошлый тариф и, если вкладку не закрывали, вчерашняя дата
    const handleClose = () => {
        setSelectedPlan(DEFAULT_PLAN);
        setPurchasedAt(getTodayDate());
        setErrorMessage('');
        onClose();
    };

    const handleSubmit = () => {
        setErrorMessage('');

        startTransition(async () => {
            const result = await purchaseSubscription({ userId, plan: selectedPlan, purchasedAt })
                .catch(() => NETWORK_ERROR_RESULT);

            if (!result.ok) {
                setErrorMessage(getPurchaseErrorMessage(result.error));
                return;
            }

            handleClose();
        });
    };

    const today = getTodayDate();

    return (
        <Modal
            isOpen={isOpen}
            title="Оформить абонемент"
            onClose={handleClose}
        >
            <p className={styles.userName}>{userName}</p>

            <fieldset className={styles.section}>
                <legend className={styles.label}>Тариф</legend>

                <div className={styles.plans}>
                    {PLANS.map(({ value, price }) => (
                        <button
                            key={value}
                            type="button"
                            aria-pressed={value === selectedPlan}
                            onClick={() => setSelectedPlan(value)}
                            className={`${styles.plan} ${value === selectedPlan ? styles.selected : ''}`}
                        >
                            <span>{PLAN_LABELS[value]}</span>
                            <span className={styles.price}>{formatPrice(price)}</span>
                        </button>
                    ))}
                </div>
            </fieldset>

            <label className={styles.section}>
                <span className={styles.label}>Дата покупки</span>

                <input
                    type="date"
                    value={purchasedAt}
                    max={today}
                    required
                    onChange={(event) => setPurchasedAt(event.target.value)}
                    className={styles.dateInput}
                />
            </label>

            <button
                type="button"
                disabled={isPending}
                onClick={handleSubmit}
                className={styles.submit}
            >
                {isPending ? 'Оформляем...' : getSubmitLabel(selectedPlan)}
            </button>

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </Modal>
    );
};
