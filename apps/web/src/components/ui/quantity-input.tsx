// apps/web/src/components/ui/quantity-input.tsx

'use client';

import { Minus, Plus, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

interface QuantityInputProps {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
    onDebouncedChange?: (value: number) => void;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    debounce?: number;
    isPending?: boolean;
}

// Custom debounce hook
function useDebouncedCallback<Args extends unknown[]>(
    callback: (...args: Args) => void,
    delay: number
): (...args: Args) => void {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debounced = useCallback(
        (...args: Args) => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);

    return debounced;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
                                                                value,
                                                                defaultValue = 1,
                                                                min = 1,
                                                                max = Infinity,
                                                                step = 1,
                                                                onChange,
                                                                onDebouncedChange,
                                                                disabled = false,
                                                                readOnly = false,
                                                                className,
                                                                debounce = 300,
                                                                isPending = false,
                                                            }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number>(value ?? defaultValue);
    const currentValue = isControlled ? value! : internalValue;

    const debouncedEmit = useDebouncedCallback((val: number) => {
        onDebouncedChange?.(val);
    }, debounce);

    const emitChange = (val: number) => {
        const clamped = Math.min(Math.max(val, min), max);
        if (!isControlled) setInternalValue(clamped);
        onChange?.(clamped);
        debouncedEmit(clamped);
    };

    const increment = () => {
        if (disabled) return;
        emitChange(currentValue + step);
    };

    const decrement = () => {
        if (disabled) return;
        emitChange(currentValue - step);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value);
        if (!isNaN(parsed)) {
            emitChange(parsed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            increment();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            decrement();
        }
    };

    // Sync controlled external value back to internal
    useEffect(() => {
        if (isControlled && value !== undefined) {
            const clamped = Math.min(Math.max(value, min), max);
            setInternalValue(clamped);
        }
    }, [isControlled, value, min, max]);

    return (
        <div className={cn('flex items-center gap-2 relative', className)}>
            <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={decrement}
                disabled={disabled || currentValue <= min}
            >
                <Minus className="w-4 h-4" />
            </Button>
            <div className="relative">
                <Input
                    type="number"
                    value={currentValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    readOnly={readOnly}
                    min={min}
                    max={max}
                    step={step}
                    className="w-16 text-center pr-6"
                />
                {isPending && (
                    <Loader className="absolute h-full right-1 top-0 animate-spin text-muted-foreground" />
                )}
            </div>
            <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={increment}
                disabled={disabled || currentValue >= max}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
};


