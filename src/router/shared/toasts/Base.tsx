import LogoIcon from '@/components/icons/Logo.tsx';

interface BaseToastProps {
    icon?: boolean;
    iconClassName?: string;

    before?: string;
    field?: string;
    after?: string;
    image?: string;
}

export default function BaseToast({
    icon,
    iconClassName,
    image,
    field,
    before,
    after
}: BaseToastProps) {
    return (
        <div className='flex items-center gap-x-2.5'>
            {icon && <LogoIcon className={iconClassName} />}
            {image && (
                <img src={image} alt='Картинка в уведомлении' className='w-8 h-8 rounded-[10px]' />
            )}
            <span className='font-bold text-additionalText'>
                {before} <span className='text-onSurface'>{field}</span> {after}
            </span>
        </div>
    );
}
