'use client';

import { Modal } from '../../modal';
import { DEFAULT_CANCEL_TEXT, DEFAULT_CONFIRM_TEXT, type ConfirmOptions } from '../lib';
import styles from './styles.module.scss';

type ConfirmDialogProps = {
    options: ConfirmOptions;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmDialog = ({ options, onConfirm, onCancel }: ConfirmDialogProps) => {
    const { title, description, confirmText, cancelText, danger } = options;

    return (
        <Modal
            isOpen
            title={title}
            onClose={onCancel}
        >
            {description && <p className={styles.description}>{description}</p>}

            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={`${styles.button} ${styles.cancel}`}
                >
                    {cancelText ?? DEFAULT_CANCEL_TEXT}
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    className={`${styles.button} ${danger ? styles.danger : styles.primary}`}
                >
                    {confirmText ?? DEFAULT_CONFIRM_TEXT}
                </button>
            </div>
        </Modal>
    );
};
