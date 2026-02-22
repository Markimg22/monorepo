import { cva } from 'class-variance-authority';

export const stepContainerVariants = cva('flex items-start w-full', {
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
            top: 'flex-col-reverse max-w-20 w-20',
            bottom: 'flex-col max-w-20 w-20',
            left: 'flex-row-reverse max-w-32 w-auto shrink-0',
            right: 'flex-row max-w-32 w-auto shrink-0'
        }
    },
    defaultVariants: {
        labelPosition: 'bottom'
    }
});

export const indicatorVariants = cva(
    'size-8 md:size-10 transition-all duration-300 rounded-full flex items-center justify-center shrink-0',
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
    'text-sm sm:text-base leading-tight text-foreground tracking-normal line-clamp-2 transition-colors duration-300 px-1',
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

export const connectorWrapperVariants = cva('flex-1 flex min-w-10', {
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

export const connectorVariants = cva('w-full h-0.5 transition-colors duration-300 mt-4 md:mt-5', {
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
