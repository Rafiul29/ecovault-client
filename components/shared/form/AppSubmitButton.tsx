import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface AppSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isPending: boolean;
    children: React.ReactNode;
    pendingLabel?: string;
    className?: string;
}


const AppSubmitButton = ({
    isPending,
    children,
    pendingLabel = "Submitting...",
    className,
    disabled = false,
    ...props
}: AppSubmitButtonProps
) => {

    const isDisabled = disabled || isPending;

    return (
        <Button
            type='submit'
            disabled={isDisabled}
            className={cn(
                "w-full h-10 text-base transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:grayscale-[0.5] shadow-sm hover:shadow-emerald-500/10",
                className
            )}
        >
            {isPending ? (
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    <span className="animate-pulse">{pendingLabel ? pendingLabel : children}</span>
                </div>
            ) : (
                <span className="flex items-center justify-center gap-2">
                    {children}
                </span>
            )
            }
        </Button>
    )
}


export default AppSubmitButton