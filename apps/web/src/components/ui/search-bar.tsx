import { useEffect, useState, useRef } from 'react';
import useDebounce from '@/hooks/use-debounce';

interface SearchInputProps {
    onDebouncedChange: (value: string) => void;
    suggestions?: string[];
    placeholder?: string;
    onSubmit?: (value: string) => void;
}

export const SearchInput = ({
                                onDebouncedChange,
                                suggestions = [],
                                placeholder = 'Search...',
                                onSubmit,
                            }: SearchInputProps) => {
    const [input, setInput] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const debounced = useDebounce(input, 300);
    const ulRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        onDebouncedChange(debounced);
    }, [debounced]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestions.length) return;

        if (e.key === 'ArrowDown') {
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault(); // Prevent problems like form submissions
            const value = activeIndex >= 0 ? suggestions[activeIndex] : input;
            setInput(value);
            onSubmit?.(value);
            // setIsFocused(false);
            setActiveIndex(-1);
        } else if (e.key === 'Escape') {
            setIsFocused(false);
            setActiveIndex(-1);
        }
    };

    const handleClickSuggestion = (value: string) => {
        setInput(value);
        onSubmit?.(value);
        setIsFocused(false);
    };

    return (
        <div className="relative w-full max-w-md">
            <input
                type="text"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    setIsFocused(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    // Check whether the suggestion area is clicked
                    requestAnimationFrame(() => {
                        if (!ulRef.current?.contains(document.activeElement)) {
                            setIsFocused(false);
                        }
                    });
                }}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />

            {isFocused && suggestions.length > 0 && (
                <ul
                    ref={ulRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto"
                >
                    {suggestions.map((s, i) => (
                        <li
                            key={i}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                i === activeIndex ? 'bg-gray-100' : ''
                            }`}
                            onMouseDown={() => handleClickSuggestion(s)}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchInput;
