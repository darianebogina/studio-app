import { createBrowserClient } from '@/shared/api';

type MagicLinkUserData = {
    first_name: string;
    last_name: string;
    phone: string;
};

type SendOtpParams = {
    email: string;
    shouldCreateUser: boolean;
    userData?: MagicLinkUserData;
};

export const sendOtp = async ({ email, shouldCreateUser, userData }: SendOtpParams) => {
    const supabase = createBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            shouldCreateUser,
            ...(userData ? { data: userData } : {}),
        },
    });

    return { error };
};