import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { logout } from '@/lib/authSession.ts';
import {
    CONFIRM_CANCEL,
    CONFIRM_DIALOG,
    CONFIRM_FOOTER,
    focusDialogItself
} from '@/router/shared/components/confirmDialog.ts';

interface LogoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Подтверждение выхода. Кнопка выхода стоит рядом с «Настройками» — промахнуться
 * легко, а вернуться = снова вводить пароль.
 */
export default function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={CONFIRM_DIALOG} onOpenAutoFocus={focusDialogItself}>
                <DialogHeader className='space-y-2'>
                    <DialogTitle className='p-0 text-xl'>Выйти из аккаунта?</DialogTitle>
                    <DialogDescription className='p-0 text-sm'>
                        Очередь плеера на этом устройстве тоже очистится.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className={CONFIRM_FOOTER}>
                    <Button
                        variant='nothing'
                        className={CONFIRM_CANCEL}
                        onClick={() => onOpenChange(false)}
                    >
                        Отмена
                    </Button>
                    <Button variant='error' className='flex-1' onClick={logout}>
                        Выйти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
