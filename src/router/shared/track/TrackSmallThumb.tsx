interface TrackThumbProps {
    imageUrl: string;
    name: string;
    authors: string[];
}

export default function TrackSmallThumb({ imageUrl, name, authors }: TrackThumbProps) {
    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <img
                    src={imageUrl}
                    alt={name}
                    className='w-12 h-12 rounded-xl object-cover'
                    draggable={false}
                />
                <div className='flex flex-col'>
                    <div className='flex items-center gap-x-2'>
                        <span className='font-bold text-onSurface'>{name}</span>
                    </div>
                    {authors &&
                        authors.map((author) => (
                            <span key={author} className='font-medium text-onSurfaceVariant'>
                                {author}
                            </span>
                        ))}
                </div>
            </div>
        </div>
    );
}
