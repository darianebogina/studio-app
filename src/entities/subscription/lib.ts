const DAYS_IN_MONTH = 30;
const MS_IN_DAY = 1000 * 60 * 60 * 24;

export const getMonthsSincePurchase = (purchasedAt: string) => {
    const diffDays = (Date.now() - new Date(purchasedAt).getTime()) / MS_IN_DAY;

    return Math.floor(diffDays / DAYS_IN_MONTH);
};
