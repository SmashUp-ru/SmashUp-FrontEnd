import { Link } from 'react-router-dom';

interface TrackThumbProps {
    imageUrl: string;
    name: string;
    authors: string[];
    link: string;
}

export default function TrackSmallThumb({ imageUrl, name, authors, link }: TrackThumbProps) {
    return (
        <Link
            to={link}
            target='_blank'
            className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'
        >
            <div className='flex items-center gap-x-4 w-full'>
                <img
                    src={imageUrl}
                    alt={name}
                    className='w-12 h-12 rounded-xl object-cover'
                    draggable={false}
                />
                <div className='flex flex-col min-w-0 w-full'>
                    <span className='font-bold text-onSurface truncate'>{name}</span>
                    <span className='font-medium text-onSurfaceVariant truncate'>
                        {authors.join(', ')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
