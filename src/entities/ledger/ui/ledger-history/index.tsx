import type { LedgerEntry } from '@/shared/types';
import { LedgerRow } from '../ledger-row';
import styles from './styles.module.scss';

type LedgerHistoryProps = {
    entries: LedgerEntry[];
};

export const LedgerHistory = ({ entries }: LedgerHistoryProps) => (
    <section className={styles.ledgerHistory}>
        <div className={styles.header}>
            <h3 className={styles.title}>История</h3>
            <p className={styles.subtitle}>Все покупки и списания</p>
        </div>

        {entries.length === 0 && <p className={styles.empty}>Пока нет операций</p>}

        {entries.length > 0 && (
            <ul className={styles.list}>
                {entries.map((entry) => (
                    <LedgerRow key={entry.id} entry={entry} />
                ))}
            </ul>
        )}
    </section>
);
