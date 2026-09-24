import { AuthLayout } from '@/features/auth';
import { LoginForm } from './login-form';

export const LoginPage = () => (
    <AuthLayout
        title="Танцевальная студия"
        subtitle="Войдите по email — пришлём ссылку для входа, пароль не нужен"
        showLogo
    >
        <LoginForm />
    </AuthLayout>
);