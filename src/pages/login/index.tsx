import { AuthLayout } from '@/features/auth';
import { LoginForm } from './login-form';

export const LoginPage = () => (
    <AuthLayout
        title="Танцевальная студия"
        subtitle="Войдите по email — пришлём код для входа, пароль не нужен"
        showLogo
    >
        <LoginForm />
    </AuthLayout>
);
