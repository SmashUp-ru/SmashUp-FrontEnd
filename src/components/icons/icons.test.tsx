import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SmashUpIcon } from '@/components/icons/SmashUp.tsx';
import YouTubeIcon from '@/components/icons/YouTube.tsx';

// React предупреждает через console.error при невалидном DOM-атрибуте
// (напр. kebab-case `clip-path` вместо `clipPath`). Этот тест ловит регресс.
function renderAndCollectWarnings(node: React.ReactElement): string[] {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(node);
    const calls = spy.mock.calls.map((c) => c.map(String).join(' '));
    spy.mockRestore();
    return calls;
}

describe('SVG-иконки не используют kebab-case DOM-атрибуты', () => {
    it('SmashUpIcon рендерится без warning про Invalid DOM property', () => {
        const warnings = renderAndCollectWarnings(<SmashUpIcon />);
        expect(
            warnings.some((w) => w.includes('Invalid DOM property') || w.includes('clip-path'))
        ).toBe(false);
    });

    it('YouTubeIcon рендерится без warning про Invalid DOM property', () => {
        const warnings = renderAndCollectWarnings(<YouTubeIcon />);
        expect(
            warnings.some((w) => w.includes('Invalid DOM property') || w.includes('clip-path'))
        ).toBe(false);
    });
});
