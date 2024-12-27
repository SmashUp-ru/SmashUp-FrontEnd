interface BaseToastProps {
    before?: string;
    field?: string;
    after?: string;
    image?: string;
}

export default function BaseToast({ image, field, before, after }: BaseToastProps) {
    return (
        <div className='flex items-center gap-x-2.5'>
            {image && (
                <img src={image} alt='Картинка в уведомлении' className='w-8 h-8 rounded-[10px]' />
            )}
            <span className='font-bold text-additionalText'>
                {before} <span className='text-onSurface'>{field}</span> {after}
            </span>
        </div>
    );
}
