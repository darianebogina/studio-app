import { getInitials } from './lib';
import styles from './styles.module.scss';

type AvatarProps = {
    firstName: string;
    lastName: string;
    size?: 'sm' | 'md' | 'lg';
};

export const Avatar = ({ firstName, lastName, size = 'md' }: AvatarProps) => (
    <div
        aria-hidden="true"
        className={`${styles.avatar} ${styles[size]}`}
    >
        {getInitials(firstName, lastName)}
    </div>
);
