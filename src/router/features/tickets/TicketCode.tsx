import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils.ts';
import { CodeType } from '@/store/ticketDrafts.ts';

/** Ширина кода в долях карты: квадратные (QR, Aztec) уже, линейные шире. */
const WIDTH: Record<Exclude<CodeType, 'text'>, string> = {
    // QR 28% ширины карты — на экране телефона это ~2 см, сканеры читают уверенно
    qr: 'w-[28cqw]',
    aztec: 'w-[26cqw]',
    pdf417: 'w-[58cqw]',
    code128: 'w-[58cqw]'
};

/**
 * Код входа на обороте. Форматы — набор, который понимают и Apple Wallet, и сканеры
 * на входе: QR, PDF417, Aztec, Code128. Рисует bwip-js в SVG; библиотеку грузим лениво
 * и только нужные энкодеры (деструктуризация в then — Rollup выкидывает остальные ~2 МБ).
 */
export default function TicketCode({ type, value }: { type: CodeType; value: string }) {
    const [svg, setSvg] = useState<string>();

    useEffect(() => {
        if (type === 'text') return;
        let cancelled = false;
        import('@bwip-js/browser')
            .then(({ qrcode, pdf417, azteccode, code128, drawingSVG }) => {
                const encode = { qr: qrcode, pdf417, aztec: azteccode, code128 }[type];
                const out = encode(
                    {
                        bcid: {
                            qr: 'qrcode',
                            pdf417: 'pdf417',
                            aztec: 'azteccode',
                            code128: 'code128'
                        }[type],
                        text: value,
                        scale: 3,
                        ...(type === 'code128' && { height: 12 }),
                        ...(type === 'qr' && { eclevel: 'M' })
                    },
                    drawingSVG()
                );
                if (!cancelled) setSvg(out);
            })
            .catch(() => !cancelled && setSvg(undefined));
        return () => {
            cancelled = true;
        };
    }, [type, value]);

    if (type === 'text')
        // шрифтом карты (своим шрифтом организатора), а не системным моно
        return (
            <span className='text-[6cqw] font-semibold tabular-nums tracking-wider'>{value}</span>
        );

    return (
        <span
            role='img'
            aria-label={`Код входа ${value}`}
            className={cn(
                'block [&>svg]:h-auto [&>svg]:w-full',
                WIDTH[type],
                // пока энкодер грузится — место под код, чтобы плашка не прыгала
                !svg && (type === 'qr' || type === 'aztec' ? 'aspect-square' : 'h-[16cqw]')
            )}
            // SVG собран bwip-js из нашего же кода входа, внешнего ввода тут нет
            dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
        />
    );
}
