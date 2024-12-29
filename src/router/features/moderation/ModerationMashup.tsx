import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button.tsx';
import EditIcon from '@/components/icons/Edit.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Label } from '@/components/ui/label.tsx';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import { Track } from '@/store/entities/track.ts';
import { cn } from '@/lib/utils.ts';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import LinkIcon from '@/components/icons/Link.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import CopiedToast from '@/router/features/toasts/copied.tsx';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { useState } from 'react';
import { UnpublishedMashupAccordionItem } from '@/router/features/moderation/UnpublishedMashupAccordionItem.tsx';

interface ModerationMashupProps {
    mashup: UnpublishedMashup;
}

export default function ModerationMashup({ mashup }: ModerationMashupProps) {
    const { toast } = useToast();

    const [value, setValue] = useState<string | undefined>(undefined);

    return (
        <Accordion type="single" collapsible value={value} onValueChange={(v) => setValue(v)}>
            <UnpublishedMashupAccordionItem value={mashup.id.toString()} accordionValue={value} mashup={mashup} />
        </Accordion>
    );
}
