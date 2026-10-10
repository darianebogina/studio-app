import { toast as sonnerToast } from 'sonner';

// Фичи импортируют toast отсюда, а не из sonner, чтобы библиотеку можно было заменить в одном месте
export const toast = {
    success: (message: string) => sonnerToast.success(message),
    error: (message: string) => sonnerToast.error(message),
    info: (message: string) => sonnerToast(message),
};
