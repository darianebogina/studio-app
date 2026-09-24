export const getAuthErrorMessage = (message: string, fallback: string) => {
    if (message === 'Signups not allowed for otp') {
        return 'Аккаунт не найден. Сначала зарегистрируйтесь.';
    }
    if (message.includes('already registered')) {
        return 'Этот email уже зарегистрирован. Войдите в аккаунт.';
    }
    if (message.includes('invalid') && message.includes('email')) {
        return 'Некорректный email';
    }
    return fallback;
};