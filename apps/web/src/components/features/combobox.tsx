'use client'

import * as React from 'react'
import {ChevronsUpDown} from 'lucide-react'
// import {Check} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import {cn} from '@/lib/utils'

export interface ComboboxOption {
    value: string
    label: string
}

interface ComboboxProps {
    options: ComboboxOption[]
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    className?: string
}

export function Combobox({
                             options,
                             value: controlledValue,
                             defaultValue = '',
                             onValueChange,
                             placeholder = 'Select...',
                             className,
                         }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [input, setInput] = React.useState('')
    const [internalValue, setInternalValue] = React.useState(defaultValue)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const handleChange = (newValue: string) => {
        if (!isControlled) {
            setInternalValue(newValue)
        }
        onValueChange?.(newValue)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full justify-between', className)}
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        placeholder="Search..."
                        className="h-9"
                        value={input}
                        onValueChange={setInput}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                // <CommandItem
                                //     key={option.value}
                                //     value={option.label} // Use label as filter keywords
                                //     onSelect={(selectedLabel) => {
                                //         console.log('---selectedLabel', selectedLabel, options)
                                //
                                //         const selectedOption = options.find(opt => opt.label.trim() === selectedLabel.trim())
                                //         console.log('---selectedOption', selectedOption)
                                //         if (selectedOption) {
                                //             handleChange(selectedOption.value)
                                //         }
                                //     }}
                                // >
                                //     {option.label}
                                //     <Check
                                //         className={cn(
                                //             'ml-auto h-4 w-4',
                                //             value === option.value ? 'opacity-100' : 'opacity-0'
                                //         )}
                                //     />
                                // </CommandItem>
                                <CommandItem
                                    key={option.value}
                                    value={option.label} // Use label to search keywords
                                    onSelect={() => handleChange(option.value)}
                                >
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
