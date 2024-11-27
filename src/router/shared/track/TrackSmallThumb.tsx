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
            <div className='flex items-center gap-x-4'>
                <img
                    src={imageUrl}
                    alt={name}
                    className='w-12 h-12 rounded-xl object-cover'
                    draggable={false}
                />
                <div className='flex flex-col'>
                    <div className='flex items-center gap-x-2 w-full'>
                        <span className='font-bold text-onSurface line-clamp-1'>{name}</span>
                    </div>
                    {authors &&
                        authors.map((author) => (
                            <span key={author} className='font-medium text-onSurfaceVariant'>
                                {author}
                            </span>
                        ))}
                </div>
            </div>
        </Link>
    );
}
