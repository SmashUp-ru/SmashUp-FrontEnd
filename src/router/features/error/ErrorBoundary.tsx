import { Component, ErrorInfo, ReactNode } from 'react';
import LogoIcon from '@/components/icons/Logo.tsx';
import { Button } from '@/components/ui/button.tsx';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Ловит рантайм-ошибки рендера в поддереве — то, что НЕ ловит router `errorElement`
 * (он перехватывает только ошибки лоадеров/экшенов/рендера самих роутов).
 * Показывает дружелюбный фолбэк вместо белого экрана.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Необработанная ошибка интерфейса:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='w-full h-full bg-primary flex items-center justify-center overflow-hidden relative'>
                    <LogoIcon
                        color='background'
                        className='absolute w-[200vw] h-[160vh] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'
                    />
                    <div className='z-10 flex flex-col items-center gap-y-[34px]'>
                        <h3 className='font-medium text-[40px] text-onSurface'>Что-то сломалось</h3>
                        <Button size='classic' onClick={() => window.location.reload()}>
                            Перезагрузить страницу
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
