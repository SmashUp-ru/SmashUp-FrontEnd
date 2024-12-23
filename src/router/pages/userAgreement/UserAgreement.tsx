import Markdown from 'react-markdown';
import UserAgreement from '@/assets/user_agreement.md?raw';

export default function UserAgreementPage() {
    return (
        <Markdown className='prose w-full min-w-full bg-background text-onBackground prose-headings:text-onBackground prose-li:text-onBackground marker:text-onBackground prose-ol:text-onBackground prose-a:text-primary '>
            {UserAgreement.valueOf()}
        </Markdown>
    );
}
