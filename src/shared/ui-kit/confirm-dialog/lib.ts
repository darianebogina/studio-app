export type ConfirmOptions = {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
};

export const DEFAULT_CONFIRM_TEXT = 'Подтвердить';
export const DEFAULT_CANCEL_TEXT = 'Отмена';
