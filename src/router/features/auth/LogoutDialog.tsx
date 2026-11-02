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
            <DialogContent className='w-[calc(100vw-2rem)] max-w-[400px]'>
                <DialogHeader>
                    <DialogTitle>Выйти из аккаунта?</DialogTitle>
                    <DialogDescription>
                        Очередь плеера на этом устройстве тоже очистится
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='gap-2'>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Отмена
                    </Button>
                    <Button variant='error' onClick={logout}>
                        Выйти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
