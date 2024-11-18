import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import ChevronRightIcon from '@/components/icons/ChevronRight.tsx';

interface ProfileThumbProps {
    img: string;
    name: string;
}

export default function ProfileSmallThumb({ img, name }: ProfileThumbProps) {
    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={img}
                        alt={name}
                        className='w-12 h-12 rounded-full group-hover:opacity-30'
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
                <span className='font-bold text-onSurface'>{name}</span>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <span>
                    <LikeOutlineIcon width={20} height={17} />
                </span>

                {/*последний элемент*/}
                <div className='w-10 flex items-center justify-center'>
                    <ChevronRightIcon />
                </div>
            </div>
        </div>
    );
}
