interface PlaylistThumbProps {
    title: string;
    author: string;
    img: string;
}

export default function PlaylistThumb({ title, author, img }: PlaylistThumbProps) {
    return (
        <div className='flex flex-col gap-y-4 p-4 h-[301px]'>
            <img src={img} alt={title} className='w-[216px] h-[216px] rounded-[30px]' />
            <div className='flex flex-col'>
                <span className='font-bold text-lg text-onSurface'>{title}</span>
                <span className='font-medium text-lg text-onSurfaceVariant'>{author}</span>
            </div>
        </div>
    );
}
