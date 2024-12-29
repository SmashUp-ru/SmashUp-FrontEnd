import { Accordion } from '@/components/ui/accordion';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { useState } from 'react';
import { UnpublishedMashupAccordionItem } from '@/router/features/moderation/UnpublishedMashupAccordionItem.tsx';

interface ModerationMashupProps {
    mashup: UnpublishedMashup;
}

export default function ModerationMashup({ mashup }: ModerationMashupProps) {
    const [value, setValue] = useState<string | undefined>(undefined);

    return (
        <Accordion
            key={mashup.id}
            type='single'
            collapsible
            value={value}
            onValueChange={(v) => setValue(v)}
        >
            <UnpublishedMashupAccordionItem
                value={mashup.id.toString()}
                accordionValue={value}
                mashup={mashup}
            />
        </Accordion>
    );
}
