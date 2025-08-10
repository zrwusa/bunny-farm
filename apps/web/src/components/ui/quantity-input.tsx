'use client';

import { Minus, Plus, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
    const [internalValue, setInternalValue] = useState<number>(
        value ?? defaultValue
    );
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

    useEffect(() => {
        if (isControlled && value !== undefined) {
            const clamped = Math.min(Math.max(value, min), max);
            setInternalValue(clamped);
        }
    }, [isControlled, value, min, max]);

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border border-border bg-background overflow-hidden h-8',
                className
            )}
        >
            <button
                type="button"
                onClick={decrement}
                disabled={disabled || currentValue <= min}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
            >
                <Minus className="w-4 h-4" />
            </button>

            <div className="relative w-8 flex items-center justify-center">
                <input
                    type="number"
                    value={currentValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    readOnly={readOnly}
                    min={min}
                    max={max}
                    step={step}
                    className="w-full text-center border-none bg-transparent text-sm focus:outline-none appearance-none
    [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
    [-moz-appearance:textfield]"
                />
                {isPending && (
                    <Loader className="absolute inset-0 m-auto w-4 h-4 animate-spin text-gray-400" />
                )}
            </div>

            {/* 加号按钮 */}
            <button
                type="button"
                onClick={increment}
                disabled={disabled || currentValue >= max}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
};
