// apps/web/src/components/ui/quantity-input.tsx

'use client';

import { Minus, Plus } from 'lucide-react';
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
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    debounce?: number;
}

// Manually implement debounce function
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
                                                                disabled = false,
                                                                readOnly = false,
                                                                className,
                                                                debounce = 300,
                                                            }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number>(value ?? defaultValue);

    const currentValue = isControlled ? value! : internalValue;

    // Use custom debounce packages onChange
    const debouncedOnChange = useDebouncedCallback((val: number) => {
        onChange?.(val);
    }, debounce);

    const setAndEmit = useCallback(
        (updater: (prev: number) => number) => {
            setInternalValue(prev => {
                const next = Math.min(Math.max(updater(prev), min), max);
                if (!isControlled) {
                    // Non-controlled: update internal and debounce emit
                    debouncedOnChange(next);
                    return next;
                } else {
                    // Controlled: only emit if different from external value
                    if (next !== value) debouncedOnChange(next);
                    return prev; // keep local value in sync via useEffect
                }
            });
        },
        [debouncedOnChange, isControlled, min, max, value]
    );

    const increment = () => {
        if (disabled) return;
        setAndEmit(prev => prev + step);
    };

    const decrement = () => {
        if (disabled) return;
        setAndEmit(prev => prev - step);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value);
        if (!isNaN(parsed)) {
            setAndEmit(() => parsed);
        }
    };

    // Allow arrow keys ↑↓ to adjust value
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            increment();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            decrement();
        }
    };

    // Synchronize when the first render or value is externally changed
    useEffect(() => {
        if (isControlled && value !== undefined) {
            const clamped = Math.min(Math.max(value, min), max);
            setInternalValue(clamped);
        }
    }, [isControlled, value, min, max]);

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={decrement}
                disabled={disabled || currentValue <= min}
            >
                <Minus className="w-4 h-4" />
            </Button>
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
                className="w-16 text-center"
            />
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

