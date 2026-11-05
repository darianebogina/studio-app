'use client';

import { useRef, type ChangeEvent, type ClipboardEvent, type FocusEvent, type KeyboardEvent } from 'react';
import { DEFAULT_OTP_LENGTH, extractDigits } from './lib';
import styles from './styles.module.scss';

type OtpInputProps = {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    autoFocus?: boolean;
    disabled?: boolean;
};

// value всегда без пропусков: цифры идут подряд с начала, пустые клетки — только в конце
export const OtpInput = ({ value, onChange, length = DEFAULT_OTP_LENGTH, autoFocus, disabled }: OtpInputProps) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const focusInput = (index: number) => inputsRef.current[Math.min(Math.max(index, 0), length - 1)]?.focus();

    const insertDigits = (index: number, digits: string) => {
        const start = Math.min(index, value.length);
        onChange((value.slice(0, start) + digits + value.slice(start + digits.length)).slice(0, length));
        focusInput(start + digits.length);
    };

    const removeDigit = (index: number) => onChange(value.slice(0, index) + value.slice(index + 1));

    // maxLength не ставим: iOS подставляет весь код из письма в первую клетку, его раскладываем по остальным
    const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            removeDigit(index);
            return;
        }

        const digits = extractDigits(e.target.value);
        if (!digits) return;

        insertDigits(index, digits);
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowLeft') focusInput(index - 1);
        if (e.key === 'ArrowRight') focusInput(index + 1);

        // Непустую клетку очищает сам браузер через onChange, здесь только переход назад из пустой
        if (e.key !== 'Backspace' || value[index] || index === 0) return;

        e.preventDefault();
        removeDigit(Math.min(index - 1, value.length - 1));
        focusInput(index - 1);
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const digits = extractDigits(e.clipboardData.getData('text')).slice(0, length);
        if (!digits) return;

        onChange(digits);
        focusInput(digits.length);
    };

    // Выделяем цифру, чтобы ввод заменял её, а не дописывал вторую
    const handleFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();

    return (
        <div className={styles.otpInput}>
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(element) => {
                        inputsRef.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    autoFocus={autoFocus && index === 0}
                    aria-label={`Цифра ${index + 1}`}
                    value={value[index] ?? ''}
                    disabled={disabled}
                    onChange={handleChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    className={styles.cell}
                />
            ))}
        </div>
    );
};
