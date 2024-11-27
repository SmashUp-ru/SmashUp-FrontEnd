import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Link } from 'react-router-dom';

interface ProfileThumbProps {
    name: string;
    caption: string;
    img: string;
}

export default function ProfileThumb({ name, caption, img }: ProfileThumbProps) {
    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <img
                    src={img}
                    alt={name}
                    className='w-[216px] h-[216px] object-cover rounded-full group-hover:opacity-30'
                    draggable={false}
                />
                <Button
                    variant='ghost'
                    size='icon'
                    className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                >
                    <HollowPlayIcon color='onSurface' hoverColor='primary' />
                </Button>
            </div>
            <div className='flex flex-col items-center'>
                <Link
                    draggable={false}
                    to={`/profile/${name}`}
                    className='font-bold text-lg text-onSurface'
                >
                    {name}
                </Link>
                <span className='font-medium text-lg text-onSurfaceVariant'>{caption}</span>
            </div>
        </div>
    );
}
