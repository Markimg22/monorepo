import { cva } from 'class-variance-authority';

export const stepContainerVariants = cva('flex w-full items-start', {
    variants: {
        labelPosition: {
            top: '',
            bottom: '',
            left: 'gap-2',
            right: 'gap-2'
        }
    },
    defaultVariants: {
        labelPosition: 'bottom'
    }
});

export const stepVariants = cva('flex items-center gap-1', {
    variants: {
        labelPosition: {
            top: 'w-20 max-w-20 flex-col-reverse',
            bottom: 'w-20 max-w-20 flex-col',
            left: 'w-auto max-w-32 shrink-0 flex-row-reverse',
            right: 'w-auto max-w-32 shrink-0 flex-row'
        }
    },
    defaultVariants: {
        labelPosition: 'bottom'
    }
});

export const indicatorVariants = cva(
    'flex size-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 md:size-10',
    {
        variants: {
            status: {
                completed: 'bg-primary text-white',
                active: 'bg-primary text-white',
                pending: 'bg-accent text-accent-foreground'
            }
        },
        defaultVariants: {
            status: 'pending'
        }
    }
);

export const labelVariants = cva(
    'line-clamp-2 px-1 text-sm leading-tight tracking-normal text-foreground transition-colors duration-300 sm:text-base',
    {
        variants: {
            status: {
                completed: 'font-medium',
                active: 'font-medium',
                pending: 'font-extralight'
            }
        },
        defaultVariants: {
            status: 'pending'
        }
    }
);

export const connectorWrapperVariants = cva('flex min-w-10 flex-1', {
    variants: {
        labelPosition: {
            top: 'items-center self-center',
            bottom: 'items-center self-start',
            left: 'items-start',
            right: 'items-start'
        }
    },
    defaultVariants: {
        labelPosition: 'bottom'
    }
});

export const connectorVariants = cva('mt-4 h-0.5 w-full transition-colors duration-300 md:mt-5', {
    variants: {
        status: {
            completed: 'bg-primary',
            active: '',
            pending: 'bg-accent'
        }
    },
    defaultVariants: {
        status: 'pending'
    }
});
