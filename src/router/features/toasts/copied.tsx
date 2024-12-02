interface CopiedToastProps {
    img: string;
    name: string;
}

export default function CopiedToast({ img, name }: CopiedToastProps) {
    return (
        <div className='flex items-center gap-x-2.5'>
            <img src={img} alt={name} className='w-8 h-8 rounded-[10px]' />

            <span className='font-bold text-additionalText'>
                Ссылка на <span className='text-onSurface'>{name}</span> скопирована в буфер обмена!
            </span>
        </div>
    );
}
