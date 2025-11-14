'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  type Option,
  isOption,
  isOptionsArray,
} from '../utils/typeGuards/optionsFields.TypeGuards';

export interface SelectAutocompleteParams
  extends React.ComponentProps<typeof Popover> {
  defaultValue?: string | number;
  onChange: (value: string | number | null) => void;
  options: Option[] | string[];
  placeholder?: string;
  legend?: string;
  id: string;
}
/**
 * ## Select Autocomplete
 *
 * A select autocomplete component that allows the user to select an option from a list of options.
 *
 * ### Attributes
 *
 * | Name | isRequired | Description | Type |
 * | --- | --- | --- | --- |
 * | defaultValue | false | The default value of the select autocomplete | string |
 * | onChange | true | The function to call when the value changes | (value: string) => void |
 * | options | true | The list of options to select from | { value: string; label: string }[] |
 * | placeholder | false | The placeholder text | string |
 * | legend | false | The legend text | string |
 *
 * #### Other attributes
 *
 * | Name | Description | Type |
 * | --- | --- | --- |
 * | children | The children of the component | React.ReactNode |
 * | open | The state of the popover | boolean |
 * | defaultOpen | The default state of the popover | boolean |
 * | onOpenChange | The function to call when the popover state changes | (open: boolean) => void |
 * | modal | The modal state of the popover | boolean |
 *
 * ### Usage & comportment
 *
 * - On Focus: The component displays a list of options.
 * - On Blur: The component hides the list of options.
 * - On Click: The component selects an option and puts it in the input. (the value is stored in the state)
 * - On Change: The component calls the `onChange` function with the selected value.
 *
 *
 * @param param0
 * @returns
 */
export const SelectAutocomplete = React.forwardRef<
  HTMLButtonElement,
  SelectAutocompleteParams
>(
  (
    {
      defaultValue,
      onChange,
      options,
      placeholder,
      legend = 'Select option...',
      id,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(props.defaultOpen || false);
    const [value, setValue] = React.useState(defaultValue || null);
    const [currentOption, setCurrentOption] = React.useState<
      Option[] | string[]
    >(options);

    React.useEffect(() => {
      onChange(value);
    }, [value, onChange]);

    const handleInputChange = (data: string) => {
      if (!data || data === '') setCurrentOption(options);
      else if (isOptionsArray(options)) {
        setCurrentOption(
          options.filter((optionItem) =>
            optionItem.label
              .toLowerCase()
              .trim()
              .includes(data.toLowerCase().trim()),
          ),
        );
      } else {
        setCurrentOption(
          options.filter((optionItem) =>
            optionItem.toLowerCase().trim().includes(data.toLowerCase().trim()),
          ),
        );
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            aria-controls={id}
            aria-haspopup="listbox"
            aria-owns={id}
            aria-autocomplete="list"
            aria-activedescendant={value ? `option-${value}` : undefined}
            id={id}
          >
            {value
              ? (() => {
                  const selected = options.find((option) =>
                    isOption(option)
                      ? option.value === value
                      : option === value,
                  );
                  if (!selected) return legend;
                  if (isOption(selected)) return selected.label;
                  if (typeof selected === 'string') return selected;
                  return legend;
                })()
              : legend}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder={placeholder}
              className="h-9"
              onValueChange={(inputValue) => handleInputChange(inputValue)}
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {currentOption &&
                  currentOption.map((option) => (
                    <CommandItem
                      id={`option-${isOption(option) ? option.value : option}`}
                      key={isOption(option) ? option.value : option}
                      value={isOption(option) ? option.label : option}
                      onSelect={(currentValue) => {
                        const selectedValue = isOptionsArray(options)
                          ? options.find(
                              (optionItem) => optionItem.label === currentValue,
                            )
                          : options.find(
                              (optionItem) => optionItem === currentValue,
                            );
                        if (!selectedValue) {
                          return;
                        }
                        const extractedValue = isOption(selectedValue)
                          ? selectedValue.value
                          : selectedValue;
                        const isUnselecting = extractedValue === value;
                        setValue(isUnselecting ? '' : extractedValue);
                        if (!isUnselecting) setOpen(false);
                      }}
                    >
                      {isOption(option) ? option.label : option}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === (isOption(option) ? option.value : option)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

SelectAutocomplete.displayName = 'SelectAutocomplete';
