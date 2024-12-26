import { DialogClose, DialogDescription } from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';

interface UsernameDialogSentContentProps {
    username: string;
}

export default function UsernameDialogSentContent({ username }: UsernameDialogSentContentProps) {
    return (
        <DialogDescription className='pt-0 flex flex-col gap-y-[30px]'>
            <span className='font-medium text-[18px] text-onSurfaceVariant text-center'>
                Мы отправили письмо на почту, привязанную к аккаунту
                <br />
                <span className='font-bold text-primary'>{username}</span>.
                <br />
                Подтвердите изменение юзернейма, нажав на кнопку внутри письма.
            </span>

            <DialogClose>
                <Button type='submit' className='w-full'>
                    Хорошо
                </Button>
            </DialogClose>
        </DialogDescription>
    );
}
