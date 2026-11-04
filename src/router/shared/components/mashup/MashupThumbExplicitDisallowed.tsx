import { Link } from 'react-router-dom';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import { Mashup } from '@/store/entities/mashup.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { coverUrl } from '@/lib/cdn.ts';
import { THUMB_ROW_HOVER } from '@/router/shared/components/thumbHover.ts';
import { cn } from '@/lib/utils.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import AuthorLinks from '@/router/shared/components/user/AuthorLinks.tsx';

interface MashupThumbExplicitDisallowedProps {
    mashup: Mashup;
    searchMode?: boolean;
}

export default function MashupThumbExplicitDisallowed({
    mashup,
    searchMode
}: MashupThumbExplicitDisallowedProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        className={cn(
                            'opacity-50 w-fit flex flex-col gap-y-4 p-4 group hover:bg-onPrimary has-[[aria-expanded=true]]:bg-onPrimary rounded-t-[46px] rounded-b-[30px]',
                            THUMB_ROW_HOVER
                        )}
                    >
                        <div className='relative'>
                            <ImageWithSkeleton
                                src={coverUrl('mashup', mashup.imageUrl, 400)}
                                alt={mashup.name}
                                className='transition-opacity duration-200 motion-reduce:transition-none w-[216px] h-[216px] rounded-[30px] md:group-hover:opacity-30 md:group-has-[[aria-expanded=true]]:opacity-30'
                                loading='lazy'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex items-center gap-x-2 min-w-0 max-w-[216px]'>
                                <Link
                                    draggable={false}
                                    to={`/mashup/${mashup.id}${searchMode ? `?searchId=${mashup.id}` : ''}`}
                                    className='font-medium text-[15px] text-onSurface truncate'
                                >
                                    {mashup.name}
                                </Link>
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
                            <div className='truncate text-left max-w-[216px] font-medium text-[15px] text-onSurfaceVariant'>
                                <AuthorLinks
                                    authors={mashup.authors}
                                    searchIds={searchMode ? mashup.authorsIds : undefined}
                                />
                            </div>
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
