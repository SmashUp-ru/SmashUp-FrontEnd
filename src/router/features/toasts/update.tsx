interface UpdateToastProps {
    field: string;
    text: string;
    image?: string;
}

export default function UpdateToast({ image, field, text }: UpdateToastProps) {
    return (
        <div className='flex items-center gap-x-2.5'>
            {image && (
                <img src={image} alt='Картинка в уведомлении' className='w-8 h-8 rounded-[10px]' />
            )}
            <span className='font-bold text-additionalText'>
                <span className='text-onSurface'>{field}</span> {text}!
            </span>
        </div>
    );
}
