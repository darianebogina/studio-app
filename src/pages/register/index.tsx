import { AuthLayout } from '@/features/auth';
import { RegisterForm } from './register-form';

export const RegisterPage = () => (
    <AuthLayout
        title="Создать аккаунт"
        subtitle="Заполните данные — их видит только преподаватель"
    >
        <RegisterForm />
    </AuthLayout>
);