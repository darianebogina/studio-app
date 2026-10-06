import { LedgerRow } from '@/entities/ledger';
import type { LedgerEntry } from '@/shared/types';
import styles from './styles.module.scss';

type StudentHistoryProps = {
    entries: LedgerEntry[];
};

export const StudentHistory = ({ entries }: StudentHistoryProps) => (
    <section className={styles.studentHistory}>
        <h2 className={styles.title}>История</h2>

        {entries.length === 0 && <p className={styles.empty}>История операций пуста</p>}

        {entries.length > 0 && (
            <ul className={styles.list}>
                {entries.map((entry) => (
                    <LedgerRow key={entry.id} entry={entry} />
                ))}
            </ul>
        )}
    </section>
);
