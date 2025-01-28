import { Link } from 'react-router-dom';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import { zip } from '@/lib/utils.ts';
import { Mashup } from '@/store/entities/mashup.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
                    <div className='opacity-50 w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
                        <div className='relative'>
                            <img
                                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`}
                                alt={mashup.name}
                                className='w-[216px] h-[216px] rounded-[30px] group-hover:opacity-30'
                                draggable={false}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex items-center gap-x-2 min-w-0 max-w-[216px]'>
                                <Link
                                    draggable={false}
                                    to={`/mashup/${mashup.id}${searchMode ? `?searchId=${mashup.id}` : ''}`}
                                    className='font-bold text-lg text-onSurface truncate'
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
                            <div className='flex items-center gap-x-2 max-w-[216px]'>
                                {zip([mashup.authorsIds, mashup.authors]).map(
                                    ([authorId, author], index) => (
                                        <div key={author}>
                                            <Link
                                                key={index}
                                                to={`/user/${author}${searchMode ? `?searchId=${authorId}` : ''}`}
                                                className='font-medium text-lg text-onSurfaceVariant truncate'
                                            >
                                                {author}
                                            </Link>
                                            {index !== mashup.authors.length - 1 && (
                                                <span className='text-onSurfaceVariant'>, </span>
                                            )}
                                        </div>
                                    )
                                )}
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
