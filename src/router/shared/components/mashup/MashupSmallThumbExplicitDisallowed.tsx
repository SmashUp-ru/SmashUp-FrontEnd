import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { cn, msToMinutesAndSeconds } from '@/lib/utils.ts';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import HashtagMashupIcon from '@/components/icons/HashtagMashup.tsx';
import AltIcon from '@/components/icons/Alt.tsx';
import { Link } from 'react-router-dom';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Mashup } from '@/store/entities/mashup.ts';

interface MashupSmallThumbExplicitDisallowedProps {
    mashup: Mashup;
    isLiked: boolean;
}

export default function MashupSmallThumbExplicitDisallowed({
    mashup,
    isLiked
}: MashupSmallThumbExplicitDisallowedProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger>
                    <div className='flex justify-between gap-x-1 p-1.5 w-full group hover:bg-hover rounded-2xl opacity-50'>
                        <div className='flex items-center gap-x-4 w-full'>
                            <div className='relative'>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_100x100.png`}
                                    alt={mashup.name}
                                    className={cn('w-12 h-12 min-w-12 min-h-12 rounded-xl')}
                                    draggable={false}
                                />
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-x-2'>
                                    <div className='font-bold text-onSurface line-clamp-1'>
                                        {mashup.name}
                                    </div>
                                    {isExplicit(mashup.statuses) && (
                                        <div className='w-[17px] h-[17px]'>
                                            <ExplicitIcon />
                                        </div>
                                    )}
                                    {isHashtagMashup(mashup.statuses) && (
                                        <div className='w-[17px] h-[17px]'>
                                            <HashtagMashupIcon />
                                        </div>
                                    )}
                                    {isAlt(mashup.statuses) && (
                                        <div className='w-[17px] h-[17px]'>
                                            <AltIcon />
                                        </div>
                                    )}
                                </div>
                                <div className='w-full flex flex-row items-center gap-x-1 line-clamp-1'>
                                    {mashup.authors.map((author, index) => (
                                        <div key={index}>
                                            <Link
                                                key={author}
                                                to={`/user/${author}`}
                                                className='font-medium text-onSurfaceVariant'
                                            >
                                                {author}
                                            </Link>

                                            {index !== mashup.authors.length - 1 && (
                                                <span className='text-onSurfaceVariant'>, </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-x-[34px]'>
                            {isLiked ? (
                                <LikeFilledIcon width={20} height={17} />
                            ) : (
                                <LikeOutlineIcon color='onSurface' width={20} height={17} />
                            )}

                            <span className='w-10 font-semibold text-[18px] text-additionalText'>
                                {msToMinutesAndSeconds(mashup.duration)}
                            </span>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Explicit контент был отключён в настройках.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
