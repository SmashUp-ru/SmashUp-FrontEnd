import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

/**
 * Подсказка к полю — «i» с тултипом, а не строка под полем.
 * Нужен TooltipProvider выше по дереву.
 */
export default function Hint({ text }: { text: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type='button'
                    aria-label={text}
                    // внутри <label>: без preventDefault клик по «i» фокусировал бы поле
                    onClick={(e) => e.preventDefault()}
                    className='inline-flex size-5 shrink-0 items-center justify-center rounded-full text-additionalText hover:text-onSurface transition-colors motion-reduce:transition-none'
                >
                    <Info className='size-4' strokeWidth={1.75} />
                </button>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    );
}
