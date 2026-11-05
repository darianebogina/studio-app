'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { OtpInput, Spinner, toast } from '@/shared/ui-kit';
import { sendOtp } from '../api/send-otp';
import { verifyCode } from '../api/verify-code';
import {
    getAuthErrorMessage,
    getVerifyCodeErrorMessage,
    OTP_LENGTH,
    type SendOtpParams,
    type SendOtpResult,
    type VerifyCodeResult,
} from '../lib';
import styles from './styles.module.scss';

const VERIFY_NETWORK_ERROR_RESULT: VerifyCodeResult = { ok: false, error: 'unknown' };
const SEND_NETWORK_ERROR_RESULT: SendOtpResult = { ok: false, error: 'unknown' };

type OtpCodeFormProps = {
    sendParams: SendOtpParams;
    onChangeEmail: () => void;
};

export const OtpCodeForm = ({ sendParams, onChangeEmail }: OtpCodeFormProps) => {
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerifying, startVerifyTransition] = useTransition();
    const [isResending, startResendTransition] = useTransition();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        startVerifyTransition(async () => {
            // При успехе action редиректит на /: промис отклоняется redirect-ошибкой, её отдаём Next
            const result = await verifyCode({ email: sendParams.email, code }).catch((error) => {
                unstable_rethrow(error);
                return VERIFY_NETWORK_ERROR_RESULT;
            });

            setErrorMessage(getVerifyCodeErrorMessage(result.error));
        });
    };

    const handleResend = () => {
        setErrorMessage('');

        startResendTransition(async () => {
            const result = await sendOtp(sendParams).catch(() => SEND_NETWORK_ERROR_RESULT);

            if (!result.ok) {
                setErrorMessage(getAuthErrorMessage(result.error, 'Не удалось отправить код. Попробуйте позже.'));
                return;
            }

            setCode('');
            toast.success('Код отправлен');
        });
    };

    const isPending = isVerifying || isResending;

    return (
        <form onSubmit={handleSubmit} className={styles.otpCodeForm}>
            <p className={styles.codeSentText}>
                Код отправлен на <b>{sendParams.email}</b>
            </p>

            <OtpInput
                value={code}
                onChange={setCode}
                length={OTP_LENGTH}
                autoFocus
                disabled={isPending}
            />

            {errorMessage && <p className={styles.error}>{errorMessage}</p>}

            <button
                type="submit"
                disabled={isPending || code.length < OTP_LENGTH}
                className={styles.button}
            >
                {isVerifying ? <Spinner size="md" color="dark" /> : 'Войти'}
            </button>

            <button
                type="button"
                disabled={isPending}
                onClick={handleResend}
                className={styles.linkButton}
            >
                {isResending ? <Spinner size="md" /> : 'Прислать код ещё раз'}
            </button>

            <button
                type="button"
                disabled={isPending}
                onClick={onChangeEmail}
                className={styles.linkButton}
            >
                Изменить email
            </button>
        </form>
    );
};
