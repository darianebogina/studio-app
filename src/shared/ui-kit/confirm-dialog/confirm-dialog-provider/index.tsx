'use client';

import { useEffect, useState } from 'react';
import { ConfirmDialog } from '../confirm-dialog';
import type { ConfirmOptions } from '../lib';
import { resolveConfirm, subscribe } from '../store';

// Рендерится в корневом layout, вне деревьев других модалок: cancel и close у <dialog>
// всплывают по дереву React и закрыли бы модалку, из которой вызван confirm
export const ConfirmDialogProvider = () => {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    useEffect(() => subscribe(setOptions), []);

    if (!options) return null;

    return (
        <ConfirmDialog
            options={options}
            onConfirm={() => resolveConfirm(true)}
            onCancel={() => resolveConfirm(false)}
        />
    );
};
