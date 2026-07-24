import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { cn, msToMinutesAndSeconds } from '@/lib/utils.ts';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import { Link } from 'react-router-dom';
import LikeFilledIcon from '@/components/icons/likeFilled/LikeFilled32';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import { Mashup } from '@/store/entities/mashup.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { THUMB_ROW_HOVER } from '@/router/shared/components/thumbHover.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

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
                    <div
                        className={cn(
                            'flex justify-between gap-x-1 p-1.5 w-full group hover:bg-onPrimary rounded-2xl opacity-50',
                            THUMB_ROW_HOVER
                        )}
                    >
                        <div className='flex items-center gap-x-4 w-full'>
                            <div className='relative'>
                                <ImageWithSkeleton
                                    src={coverUrl('mashup', mashup.imageUrl, 100)}
                                    alt={mashup.name}
                                    className={cn('w-11 h-11 min-w-11 min-h-11 rounded-xl')}
                                    loading='lazy'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-x-1'>
                                    <div className='font-bold text-sm text-onSurface line-clamp-1'>
                                        {mashup.name}
                                    </div>
                                    <div className='flex items-center gap-x-0'>
                                        {isExplicit(mashup.statuses) && (
                                            <div className='w-[24px] h-[24px]'>
                                                <ExplicitIcon />
                                            </div>
                                        )}
                                        {isHashtagMashup(mashup.statuses) && (
                                            <div className='w-[24px] h-[24px]'>
                                                <HashtagMashupIcon />
                                            </div>
                                        )}
                                        {isAlt(mashup.statuses) && (
                                            <div className='w-[24px] h-[24px]'>
                                                <AltIcon />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='w-full flex flex-row items-center gap-x-1 line-clamp-1'>
                                    {mashup.authors.map((author, index) => (
                                        <div key={index}>
                                            <Link
                                                key={author}
                                                to={`/user/${author}`}
                                                className='font-medium text-[13px] text-onSurfaceVariant'
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
                            {isLiked ? <LikeFilledIcon /> : <LikeOutlineIcon color='onSurface' />}

                            <span className='w-10 font-semibold text-[13px] text-additionalText'>
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
