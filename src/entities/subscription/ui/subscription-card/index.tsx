import type { Subscription } from '@/shared/types';
import { PLAN_LABELS } from '../../model/types';
import styles from './styles.module.scss';

type SubscriptionCardProps = {
    subscription: Subscription;
    onClick?: () => void;
};

export const SubscriptionCard = ({ subscription, onClick }: SubscriptionCardProps) => {
    const {
        plan,
        group_total: groupTotal,
        group_remaining: groupRemaining,
        individual_total: individualTotal,
        individual_remaining: individualRemaining,
    } = subscription;

    return (
        <button
            type="button"
            aria-haspopup="dialog"
            onClick={onClick}
            className={styles.subscriptionCard}
        >
            <span className={styles.plan}>{PLAN_LABELS[plan]}</span>

            <span className={styles.counters}>
                {groupTotal > 0 && (
                    <span className={styles.counter}>
                        <span className={styles.counterValue}>
                            {groupRemaining} из {groupTotal}
                        </span>
                        <span className={styles.counterLabel}>групповых</span>
                    </span>
                )}

                {individualTotal > 0 && (
                    <span className={styles.counter}>
                        <span className={styles.counterValue}>
                            {individualRemaining} из {individualTotal}
                        </span>
                        <span className={styles.counterLabel}>индивидуальных</span>
                    </span>
                )}
            </span>
        </button>
    );
};
