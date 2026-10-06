import { formatShortDate } from '@/shared/lib/date';
import type { LedgerEntry } from '@/shared/types';
import { formatLedgerDelta } from '../../lib';
import styles from './styles.module.scss';

type LedgerRowProps = {
    entry: LedgerEntry;
};

export const LedgerRow = ({ entry }: LedgerRowProps) => {
    const { text, variant } = formatLedgerDelta(entry);

    return (
        <li className={styles.ledgerRow}>
            <div className={styles.info}>
                <time dateTime={entry.created_at} className={styles.date}>
                    {formatShortDate(entry.created_at)}
                </time>
                <span className={styles.note}>{entry.note}</span>
            </div>

            <span className={`${styles.delta} ${styles[variant]}`}>{text}</span>
        </li>
    );
};
