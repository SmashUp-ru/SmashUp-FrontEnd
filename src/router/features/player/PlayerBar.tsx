import Player from '@/router/features/player/Player.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Link } from 'react-router-dom';
import ShuffleIcon from '@/components/icons/Shuffle.tsx';
import SkipLeftIcon from '@/components/icons/SkipLeft.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import SkipRightIcon from '@/components/icons/SkipRight.tsx';
import RepeatIcon from '@/components/icons/Repeat.tsx';
import InfoIcon from '@/components/icons/Info.tsx';
import VolumeIcon from '@/components/icons/Volume.tsx';
import { usePlayerStore } from '@/store/player.ts';
import HollowPauseIcon from '@/components/icons/HollowPauseIcon.tsx';

export default function PlayerBar() {
    const { src, isPlaying, loop, updateLoop, info, updateInfo } = usePlayerStore();

    if (!src) {
        return;
    }

    return (
        <div className='mt-auto mb-4 mr-4 h-[96px] p-4 flex flex-wrap items-center justify-between bg-surface rounded-[30px]'>
            <div className='w-full flex justify-between items-center'>
                {/*левая часть*/}
                <div className='w-1/3 flex items-center gap-x-6'>
                    <img
                        src='https://s3-alpha-sig.figma.com/img/6158/4e0e/f870d3d8df844dcd031aa1eebd4fb001?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C2FEEGt2kkFdwiQumuW-7T3fYGzcAZ42FGQRqAvXXQ6vPYtS-yJdn8UOs7Z2xiFDaqdx4ensemDh8JAB7f-~LbiHPMSVhl2iZ7Nt6xqvq5SCV1Bcd3Woh4KU~1H~gDdFaOoKPhFW5ekJPdJJ6iO5Dwl57XT5pjgFobm8mnCweWoWd1Fkaolh8zZS6GiIOO6xRKm4I5sJD0h-5CK-wq1U-lUU8nmr0fpUPT8yy91jNQ~XbGKk7Gr2e8gDawph36B5LTmvyBOKalEU40chd1-aqT1z2EV2MFwbnPrM-dmYuWSi3CkGwyM9vsZHbOiMHQpwNDiMbHGyi1-Nv8M31UsQOg__'
                        alt='mashup title'
                        className='w-16 h-16 rounded-2xl'
                        draggable={false}
                    />

                    <div className='flex flex-col'>
                        <span className='font-bold text-[18px] text-onSurface'>
                            Леонид, дай денег
                        </span>
                        <Link to='/profile/warkkaa' className='font-medium text-onSurfaceVariant'>
                            warkkaa
                        </Link>
                    </div>

                    <Button variant='ghost' size='icon'>
                        <LikeOutlineIcon />
                    </Button>
                </div>

                {/*центральная часть*/}
                <div className='absolute left-1/2 transform -translate-x-1/2  flex flex-row justify-center items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => {}}>
                        <ShuffleIcon />
                    </Button>

                    <Button variant='ghost' size='icon'>
                        <SkipLeftIcon />
                    </Button>

                    {isPlaying ? (
                        <Button variant='ghost' size='icon'>
                            <HollowPauseIcon color='onSurfaceVariant' />
                        </Button>
                    ) : (
                        <Button variant='ghost' size='icon'>
                            <HollowPlayIcon color='onSurfaceVariant' />
                        </Button>
                    )}

                    <Button variant='ghost' size='icon'>
                        <SkipRightIcon />
                    </Button>

                    <Button variant='ghost' size='icon' onClick={() => updateLoop(!loop)}>
                        <RepeatIcon repeating={loop} />
                    </Button>
                </div>

                {/*правая часть*/}
                <div className='w-1/3 flex justify-end items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => updateInfo(!info)}>
                        <InfoIcon />
                    </Button>

                    <VolumeIcon />

                    {/*временная замена слайдеру громкости TODO*/}
                    <div className='flex items-center'>
                        <div className='w-[82px] h-[5px] bg-onSurface rounded-l' />
                        <div className='w-[68px] h-[5px] bg-surfaceVariant rounded-r' />
                    </div>
                </div>
            </div>
            <Player />
        </div>
    );
}
