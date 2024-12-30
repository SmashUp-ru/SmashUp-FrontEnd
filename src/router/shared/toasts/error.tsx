import LogoIcon from '@/components/icons/Logo.tsx';
import { cn } from '@/lib/utils.ts';

interface ErrorToastProps {
    icon?: boolean;
    iconClassName?: string;

    before?: string;
    field?: string;
    after?: string;
    image?: string;
}

export default function ErrorToast({
    icon,
    iconClassName,
    image,
    field,
    before,
    after
}: ErrorToastProps) {
    return (
        <div className='flex items-center gap-x-2.5'>
            {icon && <LogoIcon className={cn('text-error', iconClassName)} />}
            {image && (
                <img src={image} alt='Картинка в уведомлении' className='w-8 h-8 rounded-[10px]' />
            )}
            <span className='font-bold text-additionalText'>
                {before} <span className='text-onSurface'>{field}</span> {after}
            </span>
        </div>
    );
}
