import Markdown from 'react-markdown';
import PrivacyPolicy from '@/assets/privacy_policy.md?raw';

export default function PrivacyPolicyPage() {
    return (
        <Markdown className='prose w-full min-w-full bg-background text-onBackground prose-headings:text-onBackground prose-li:text-onBackground marker:text-onBackground prose-ol:text-onBackground prose-a:text-primary '>
            {PrivacyPolicy.valueOf()}
        </Markdown>
    );
}
