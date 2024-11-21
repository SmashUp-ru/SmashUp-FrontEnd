import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Link } from 'react-router-dom';

interface MashupThumbProps {
    imageUrl: string;
    name: string;
    authors: string[];
    durationStr: string;
}

export default function MashupThumb({ imageUrl, name, authors, durationStr }: MashupThumbProps) {
    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${imageUrl}_100x100.png`}
                        alt={name}
                        className='w-12 h-12 rounded-xl group-hover:opacity-30'
                        draggable={false}
                    />
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    >
                        <HollowPlayIcon color='onSurface' size={24} />
                    </Button>
                </div>
                <div className='flex flex-col'>
                    <span className='font-bold text-onSurface'>{name}</span>
                    {authors &&
                        authors.map((author) => (
                            <Link
                                to={`/profile/${author}`}
                                className='font-medium text-onSurfaceVariant'
                            >
                                {author}
                            </Link>
                        ))}
                </div>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <span>
                    <LikeOutlineIcon width={20} height={17} />
                </span>

                <div className='w-10 flex items-center justify-center'>
                    <span className='font-semibold text-[18px] text-additionalText group-hover:hidden'>
                        {durationStr}
                    </span>
                    <span className='group-hover:block hidden'>
                        <MoreHorizontalIcon />
                    </span>
                </div>
            </div>
        </div>
    );
}
