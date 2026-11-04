import Link from 'next/link';
import { AuthLayout, isEmailOtpType } from '@/features/auth';
import { ConfirmEmailForm } from './confirm-email-form';
import styles from './styles.module.scss';

type AuthConfirmPageProps = {
    searchParams: Promise<{ token_hash?: string; type?: string }>;
};

export const AuthConfirmPage = async ({ searchParams }: AuthConfirmPageProps) => {
    const { token_hash: tokenHash, type } = await searchParams;

    if (!tokenHash || !isEmailOtpType(type)) {
        return (
            <AuthLayout
                title="Ссылка недействительна"
                subtitle="Запросите новую ссылку для входа"
            >
                <Link href="/login" className={styles.link}>
                    Ко входу
                </Link>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Вход в приложение"
            subtitle="Нажмите кнопку, чтобы войти"
            showLogo
        >
            <ConfirmEmailForm tokenHash={tokenHash} type={type} />
        </AuthLayout>
    );
};
