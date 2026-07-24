import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            // `group` — чтобы иконки внутри пункта могли красить себя через
            // group-data-[highlighted]; подсветка на data-[highlighted] (Radix ставит
            // его и при наведении мышью, и при навигации с клавиатуры), а не на :hover.
            'group flex cursor-default gap-2 select-none items-center rounded-[14px] px-4 py-[13px] font-medium outline-none transition-colors',
            'data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary data-[state=open]:bg-primary/20 data-[state=open]:text-primary',
            inset && 'pl-8',
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className='ml-auto size-4 opacity-60' />
    </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
    // alignOffset компенсирует внутренний паддинг меню (p-1 = 4px): Radix
    // выравнивает подменю по краю ТРИГГЕРА, а первый пункт подменю отстоит от
    // этого края на паддинг — без сдвига подсветки триггера и первого пункта
    // оказываются на разных линиях.
>(({ className, sideOffset = 4, alignOffset = -4, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
            'z-50 min-w-[10rem] rounded-[18px] bg-surface p-1 text-onSurface font-medium',
            'shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]',
            '[transform-origin:var(--radix-dropdown-menu-content-transform-origin)]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-150 data-[state=open]:ease-out',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100',
            'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
            'motion-reduce:animate-none',
            className
        )}
        {...props}
    />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-50 min-w-[10rem] rounded-[18px] bg-surface p-1 text-onSurface font-medium',
                'shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]',
                '[transform-origin:var(--radix-dropdown-menu-content-transform-origin)]',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-150 data-[state=open]:ease-out',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100',
                'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
                'motion-reduce:animate-none',
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            'group relative flex cursor-default select-none items-center gap-2 rounded-[14px] px-4 py-[13px] font-medium outline-none',
            'transition-colors [transition-duration:120ms] motion-reduce:transition-none',
            'data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            'group relative flex cursor-default select-none items-center rounded-[14px] py-2 pl-9 pr-3 font-medium outline-none transition-colors',
            'data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        checked={checked}
        {...props}
    >
        <span className='absolute left-3 flex size-4 items-center justify-center'>
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className='h-4 w-4' />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            'group relative flex cursor-default select-none items-center rounded-[14px] py-2 pl-9 pr-3 font-medium outline-none transition-colors',
            'data-[highlighted]:bg-primary/20 data-[highlighted]:text-primary',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        {...props}
    >
        <span className='absolute left-3 flex size-4 items-center justify-center'>
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle className='h-2 w-2 fill-current' />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn(
            'px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-onSurfaceVariant',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={
            // был bg-onError (почти чёрный) — на surface разделитель не читался
            cn('my-1 h-px bg-white/10', className)
        }
        {...props}
    />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
    );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup
};
