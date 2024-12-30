import BaseToast from '@/router/shared/toasts/base.tsx';

interface CopiedToastProps {
    img: string;
    name: string;
}

export default function CopiedToast({ img, name }: CopiedToastProps) {
    return (
        <BaseToast
            image={img}
            before='Ссылка на'
            field={name}
            after='скопирована в буфер обмена!'
        />
    );
}
