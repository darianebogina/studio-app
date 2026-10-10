import type { ConfirmOptions } from './lib';

type ConfirmState = ConfirmOptions | null;
type Subscriber = (state: ConfirmState) => void;

let currentState: ConfirmState = null;
let currentResolve: ((value: boolean) => void) | null = null;
const subscribers = new Set<Subscriber>();

const notify = () => subscribers.forEach((subscriber) => subscriber(currentState));

export const resolveConfirm = (value: boolean) => {
    if (!currentResolve) return;

    currentResolve(value);
    currentState = null;
    currentResolve = null;
    notify();
};

export const openConfirm = (options: ConfirmOptions) => {
    // Новый confirm поверх неотвеченного: старый промис иначе так и не завершится
    resolveConfirm(false);

    return new Promise<boolean>((resolve) => {
        currentState = options;
        currentResolve = resolve;
        notify();
    });
};

export const subscribe = (subscriber: Subscriber) => {
    subscribers.add(subscriber);
    subscriber(currentState);

    return () => {
        subscribers.delete(subscriber);
    };
};
