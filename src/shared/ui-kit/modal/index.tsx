'use client';

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { CLOSE_ICON_SIZE } from './lib';
import styles from './styles.module.scss';

type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) dialog.showModal();
        if (!isOpen && dialog.open) dialog.close();
    }, [isOpen]);

    // Контент лежит во внутреннем блоке, поэтому клик с target === <dialog> — это клик по подложке
    const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={handleClick}
            className={styles.modal}
        >
            {/* Контент не попадает в SSR-разметку, пока модалка закрыта: даты и Date.now()
                на сервере и в браузере могут отличаться и сломать гидрацию */}
            {isOpen && (
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h2 id={titleId} className={styles.title}>{title}</h2>

                        <button
                            type="button"
                            aria-label="Закрыть"
                            onClick={onClose}
                            className={styles.closeButton}
                        >
                            <X size={CLOSE_ICON_SIZE} />
                        </button>
                    </div>

                    {children}
                </div>
            )}
        </dialog>
    );
};
