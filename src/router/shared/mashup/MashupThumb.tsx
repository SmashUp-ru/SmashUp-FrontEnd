import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Link } from 'react-router-dom';

interface MashupThumbProps {
    img: string;
    title: string;
    author: string;
    length: string;
}

export default function MashupThumb({ img, title, author, length }: MashupThumbProps) {
    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={img}
                        alt={title}
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
                    <span className='font-bold text-onSurface'>{title}</span>
                    <Link to={`/profile/${author}`} className='font-medium text-onSurfaceVariant'>
                        {author}
                    </Link>
                </div>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <span>
                    <LikeOutlineIcon width={20} height={17} />
                </span>

                <div className='w-10 flex items-center justify-center'>
                    <span className='font-semibold text-[18px] text-additionalText group-hover:hidden'>
                        {length}
                    </span>
                    <span className='group-hover:block hidden'>
                        <MoreHorizontalIcon />
                    </span>
                </div>
            </div>
        </div>
    );
}
