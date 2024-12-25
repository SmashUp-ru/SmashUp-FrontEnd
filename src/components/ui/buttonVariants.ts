import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-surface font-bold text-[20px] hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'font-bold text-[20px] border border-onPrimary bg-background text-onBackground hover:opacity-[90%]',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:opacity-90',
                link: 'text-primary underline-offset-4 hover:underline',
                nothing: 'text-inherit font-inherit'
            },
            size: {
                default: 'rounded-2xl px-4 py-[13.5px]',
                sm: 'px-4 py-2 font-bold text-[18px] rounded-xl',
                classic: 'rounded-2xl font-bold text-xl px-6 py-3 w-fit',
                icon: 'p-0'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

export { buttonVariants };
