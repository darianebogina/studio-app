import { WifiOff } from 'lucide-react';
import { OFFLINE_ICON_SIZE } from './lib';
import styles from './styles.module.scss';

export const OfflinePage = () => (
    <main className={styles.offlinePage}>
        <div className={styles.card}>
            <WifiOff
                size={OFFLINE_ICON_SIZE}
                aria-hidden="true"
                className={styles.icon}
            />

            <h1 className={styles.title}>Нет связи</h1>

            <p className={styles.description}>
                Проверьте подключение к интернету и попробуйте снова
            </p>
        </div>
    </main>
);
