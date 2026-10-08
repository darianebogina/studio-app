type PluralForms = [one: string, few: string, many: string];

// Русское согласование: 1, 21 → one; 2–4, 22–24 → few; 0, 5–20, 11–14 → many
export const pluralize = (count: number, [one, few, many]: PluralForms) => {
    const lastTwoDigits = Math.abs(count) % 100;
    const lastDigit = lastTwoDigits % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return many;
    if (lastDigit === 1) return one;
    if (lastDigit >= 2 && lastDigit <= 4) return few;

    return many;
};
