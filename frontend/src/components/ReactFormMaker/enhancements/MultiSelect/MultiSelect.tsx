'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
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
import BadgeItem from './BadgeItem';
import useResizeObserver from '@react-hook/resize-observer';
import { ClassValue } from 'clsx';

export type Option = { value: string | number; label: string };

export interface MultiSelectParams
  extends React.ComponentProps<typeof Popover> {
  defaultValues?: string[];
  onChange: (values: string[]) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  legend?: string;
  id: string;
  className?: ClassValue[] | string | undefined;
}
/**
 * ## MultiSelect Autocomplete
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
export function MultiSelect({
  defaultValues,
  onChange,
  options,
  placeholder,
  legend = 'Select option...',
  id,
  className,
  ...props
}: MultiSelectParams) {
  const inputTrigger = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(props.defaultOpen || false);
  const [value, setValue] = React.useState<(string | number)[]>(
    defaultValues || [],
  );
  const [currentOption, setCurrentOption] = React.useState<Option[] | null>(
    options,
  );
  const [widthCombobox, setWidthCombobox] = React.useState<number | null>(null);
  const widthInputTrigger = useResizeObserver(inputTrigger, (entry) => {
    //select padding ref to add padding
    setWidthCombobox(entry.borderBoxSize[0].inlineSize);
  });

  function pushValue(newValue: string | number) {
    setValue([...value, newValue]);
  }

  function removeValue(valueToRemove: string | number) {
    setValue(value.filter((v) => v !== valueToRemove));
  }

  React.useEffect(() => {
    if (!value.length) {
      setCurrentOption(options);
      return;
    }
  }, [value]);

  const handleInputChange = (value: string) => {
    setCurrentOption(
      options.filter((option) =>
        option.label.toLowerCase().trim().includes(value.toLowerCase().trim()),
      ),
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <div
          ref={inputTrigger}
          className={cn(
            'w-full max-w-full wrap p-2 inline-flex rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            'border border-input bg-background-muted shadow-sm hover:bg-accent hover:text-accent-foreground',
            className,
          )}
          role="combobox"
          aria-expanded={open}
          aria-controls={id}
          aria-haspopup="listbox"
          aria-owns={id}
          aria-autocomplete="list"
          id={id}
        >
          <div className="flex flex-wrap gap-2 w-full max-w-full">
            {value.length
              ? value.map((v) => (
                  <BadgeItem
                    key={v}
                    option={options.find((option) => option.value === v)}
                    onRemove={removeValue}
                  />
                ))
              : legend}
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[100%] p-0"
        style={{
          width: `${widthCombobox}px`,
        }}
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            onValueChange={(value) => handleInputChange(value)}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {currentOption &&
                currentOption.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={(currentValue) => {
                      const selectedValue = options.find(
                        (option) => option.label === currentValue,
                      )?.value;
                      if (!selectedValue) {
                        return;
                      }
                      const isUnselecting = value.includes(selectedValue);
                      isUnselecting
                        ? removeValue(selectedValue)
                        : pushValue(selectedValue);
                    }}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        value.includes(option.value)
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
}
