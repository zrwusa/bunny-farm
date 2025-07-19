import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define buttonVariants same as in your ui/button.ts
const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'underline-offset-4 hover:underline text-primary',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 px-3 rounded-md',
                lg: 'h-11 px-8 rounded-md',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

// Combine props manually to avoid TS conflict
type ButtonLinkProps = LinkProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
    VariantProps<typeof buttonVariants> & {
    className?: string;
};

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
    ({ className, href, variant, size, ...props }, ref) => {
        return (
            <Link
                href={href}
                {...props}
                ref={ref}
                className={cn(buttonVariants({ variant, size }), className)}
            />
        );
    }
);
ButtonLink.displayName = 'ButtonLink';
