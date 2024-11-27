import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';

interface PlaylistThumbProps {
    id: number;
    name: string;
    authors: string[];
    img: string;
}

export default function PlaylistThumb({ id, name, authors, img }: PlaylistThumbProps) {
    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <Link draggable={false} to={`/playlist/${id}`}>
                    <img
                        src={img}
                        alt={name}
                        className='w-[216px] h-[216px] rounded-[30px] group-hover:opacity-30'
                        draggable={false}
                    />
                </Link>
                <Button
                    variant='ghost'
                    size='icon'
                    className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                >
                    <HollowPlayIcon color='onSurface' hoverColor='primary' />
                </Button>
            </div>
            <div className='flex flex-col'>
                <Link
                    to={`/playlist/${id}`}
                    className='font-bold text-lg text-onSurface truncate w-[216px]'
                    title={name}
                >
                    {name}
                </Link>
                <div className='flex items-center gap-x-2'>
                    {authors &&
                        authors.map((author, index) => (
                            <Link
                                key={index}
                                to={`/profile/${author}`}
                                className='font-medium text-lg text-onSurfaceVariant truncate'
                            >
                                {author}
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
}
