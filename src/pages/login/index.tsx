import {LoginForm} from './login-form';
import styles from './styles.module.scss';

export const LoginPage = () => (
    <main className={styles.container}>
        <div className={styles.card}>
            <div className={styles.logo}>💃</div>
            <h1 className={styles.title}>Танцевальная студия</h1>
            <p className={styles.subtitle}>
                Войдите по email — пришлём ссылку для входа, пароль не нужен
            </p>
            <LoginForm/>
        </div>
    </main>
);
