import { Geist } from 'next/font/google';

const geist = Geist({
    variable: '--font-geist',
    subsets: ['latin', 'cyrillic'],
});

export const fontVariables = geist.variable;
