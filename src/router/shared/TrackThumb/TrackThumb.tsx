interface TrackThumbProps {
    img: string;
    title: string;
    author: string;
    length: string;
}

export default function TrackThumb({ img, title, author, length }: TrackThumbProps) {
    return (
        <div className='flex justify-between p-1.5 w-full'>
            <div className='flex items-center gap-x-4'>
                <img src={img} alt={title} className='w-12 h-12 rounded-xl' />
                <div className='flex flex-col'>
                    <span>{title}</span>
                    <span>{author}</span>
                </div>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <span className='text-additionalText'>{length}</span>
            </div>
        </div>
    );
}
