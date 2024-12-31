import { Button } from '@/components/ui/button.tsx';
import { useGlobalStore } from '@/store/global.ts';

export default function DebugPage() {
    const { isLoading, updateIsLoading } = useGlobalStore();

    const currentUser = useGlobalStore((state) => state.currentUser);
    if (currentUser === null) return null;

    return (
        <div>
            <Button
                onClick={() => {
                    updateIsLoading(!isLoading);
                }}
            >
                press me
            </Button>
        </div>
    );
}
