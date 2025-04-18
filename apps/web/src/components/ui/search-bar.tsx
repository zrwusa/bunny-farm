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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounced = useDebounce(input, 300);
    const ulRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log('SearchInput - Current suggestions:', suggestions);
        console.log('SearchInput - isFocused:', isFocused);
        console.log('SearchInput - showSuggestions:', showSuggestions);
        onDebouncedChange(debounced);
    }, [debounced, suggestions, isFocused, showSuggestions]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!suggestions.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
            setShowSuggestions(true);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
            setShowSuggestions(true);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const value = activeIndex >= 0 ? suggestions[activeIndex] : input;
            setInput(value);
            onSubmit?.(value);
            setShowSuggestions(false);
            setActiveIndex(-1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }
    };

    const handleClickSuggestion = (value: string) => {
        setInput(value);
        onSubmit?.(value);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    setIsFocused(true);
                    setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    setIsFocused(true);
                    if (suggestions.length > 0) {
                        setShowSuggestions(true);
                    }
                }}
                onBlur={() => {
                    // Delay hiding suggestions to allow for click events
                    setTimeout(() => {
                        if (!ulRef.current?.contains(document.activeElement)) {
                            setShowSuggestions(false);
                        }
                    }, 200);
                }}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />

            {showSuggestions && suggestions.length > 0 && (
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
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleClickSuggestion(s);
                            }}
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
