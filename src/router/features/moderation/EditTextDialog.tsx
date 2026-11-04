import { FormEvent, useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import EditIcon from '@/components/icons/edit/Edit24';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';
import { CONFIRM_CANCEL, CONFIRM_FOOTER } from '@/router/shared/components/confirmDialog.ts';

interface EditTextDialogProps {
    title: string;
    ariaLabel: string;
    initial: string;
    placeholder?: string;
    maxLength?: number;
    /** Пустое значение допустимо (например, убрать ссылку). */
    allowEmpty?: boolean;
    /** Сохранение; ошибку показывает сам вызывающий (тостом) и пробрасывает — диалог не закроется. */
    onSave: (value: string) => Promise<unknown>;
}

/** Карандаш → модалка с одним полем, как правка ника/почты в настройках. */
export default function EditTextDialog({
    title,
    ariaLabel,
    initial,
    placeholder,
    maxLength,
    allowEmpty = false,
    onSave
}: EditTextDialogProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initial);
    const { sent, guard } = useSubmitGuard();

    useEffect(() => {
        if (open) setValue(initial);
    }, [open, initial]);

    const trimmed = value.trim();
    const canSave = !sent && trimmed !== initial.trim() && (allowEmpty || trimmed.length > 0);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        guard(async () => {
            await onSave(trimmed);
            setOpen(false);
        }).catch(() => {});
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='ghost'
                    size='control'
                    aria-label={ariaLabel}
                    onClick={(e) => e.stopPropagation()}
                >
                    <EditIcon color='onSurfaceVariant' />
                </Button>
            </DialogTrigger>
            <DialogContent
                className='w-[calc(100vw-2rem)] max-w-[460px] rounded-[28px] p-6 gap-6'
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={submit} className='flex flex-col gap-6'>
                    <DialogHeader>
                        <DialogTitle className='p-0 text-xl'>{title}</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={value}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                    />
                    <DialogFooter className={CONFIRM_FOOTER}>
                        <Button
                            type='button'
                            variant='nothing'
                            className={CONFIRM_CANCEL}
                            onClick={() => setOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button type='submit' className='flex-1' disabled={!canSave}>
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
