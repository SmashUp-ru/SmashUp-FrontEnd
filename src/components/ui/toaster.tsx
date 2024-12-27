import { useToast } from '@/router/shared/hooks/use-toast';
import { Toast, ToastClose, ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ element, ...props }) {
                return (
                    <Toast {...props}>
                        <div className='flex items-center gap-x-2.5'>
                            {element}
                            <ToastClose />
                        </div>
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
