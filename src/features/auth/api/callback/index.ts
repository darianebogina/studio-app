import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@/shared/api/server';

export const GET = async (request: NextRequest) => {
    const { searchParams, origin } = request.nextUrl;
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=missing_code`);
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(`${origin}/login?error=invalid_code`);
    }

    return NextResponse.redirect(`${origin}${next}`);
};
