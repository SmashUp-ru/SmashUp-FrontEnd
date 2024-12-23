import Markdown from 'react-markdown';
import dmca from '@/assets/dmca.md?raw';

export default function DMCAPage() {
    return (
        <Markdown className='prose w-full min-w-full bg-background text-onBackground prose-headings:text-onBackground prose-li:text-onBackground marker:text-onBackground prose-ol:text-onBackground prose-a:text-primary '>
            {dmca.valueOf()}
        </Markdown>
    );
}
