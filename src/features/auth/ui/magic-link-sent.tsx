import type { ReactNode } from 'react';
import styles from './styles.module.scss';

type MagicLinkSentProps = {
    email: string;
    text: ReactNode;
    onReset?: () => void;
    resetLabel?: string;
};

export const MagicLinkSent = ({ email, text, onReset, resetLabel }: MagicLinkSentProps) => (
    <div className={styles.success}>
        <p className={styles.successTitle}>Проверьте почту</p>
        <p className={styles.successText}>
            На <b>{email}</b> {text}
        </p>
        {onReset && (
            <button type="button" onClick={onReset} className={styles.linkButton}>
                {resetLabel}
            </button>
        )}
    </div>
);