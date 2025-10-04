import ChevronLeftIcon from '@/components/icons/ChevronLeft.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
    const navigate = useNavigate();

    return (
        <Button
            variant='ghost'
            size='icon'
            className='rounded-full bg-surface w-[40px] h-[40px]'
            onClick={() => navigate(-1)}
        >
            <ChevronLeftIcon className='w-[40px]' />
        </Button>
    );
}
