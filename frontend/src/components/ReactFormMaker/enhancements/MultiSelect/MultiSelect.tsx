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
import useResizeObserver from '@react-hook/resize-observer';
import { ClassValue } from 'clsx';
import BadgeItem from './BadgeItem';

export type Option = { value: string | number; label: string };

export interface MultiSelectParams
  extends React.ComponentProps<typeof Popover> {
  defaultValues?: string[];
  onChange: (values: string[] | number[]) => void;
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
export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectParams>(
  (
    {
      defaultValues,
      onChange,
      options,
      placeholder,
      legend = 'Select option...',
      id,
      className,
      ...props
    }: MultiSelectParams,
    ref,
  ) => {
    const inputTrigger = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(props.defaultOpen || false);
    const [value, setValue] = React.useState<string[] | number[]>(
      defaultValues || [],
    );
    const [currentOption, setCurrentOption] = React.useState<Option[] | null>(
      options,
    );
    const [widthCombobox, setWidthCombobox] = React.useState<number | null>(
      null,
    );

    useResizeObserver(inputTrigger, (entry) => {
      setWidthCombobox(entry.borderBoxSize[0].inlineSize);
    });

    function pushValue(newValue: string | number): void {
      if (
        (value.every((item) => typeof item === 'string') &&
          typeof newValue === 'string') ||
        (value.length === 0 && typeof newValue === 'string')
      ) {
        const newArr = [...(value as string[]), newValue];
        setValue(newArr);
        onChange(newArr);
      } else if (
        (value.every((item) => typeof item === 'number') &&
          typeof newValue === 'number') ||
        (value.length === 0 && typeof newValue === 'number')
      ) {
        const newArr = [...(value as number[]), newValue];
        setValue(newArr);
        onChange(newArr);
      } else {
        console.warn(
          'HAS every item go number ?',
          value.every((item) => typeof item === 'number'),
          value,
        );
        console.warn(
          `Type mismatch: expected 'string' or 'number', got ${typeof newValue}`,
        );
      }
    }

    function removeValue(valueToRemove: string | number) {
      let newArr: typeof value;
      if (
        (value.every((item) => typeof item === 'string') &&
          typeof valueToRemove === 'string') ||
        (value.length === 0 && typeof valueToRemove === 'string')
      ) {
        newArr = value.filter((v) => v !== valueToRemove) as string[];
      } else if (
        (value.every((item) => typeof item === 'number') &&
          typeof valueToRemove === 'number') ||
        (value.length === 0 && typeof valueToRemove === 'number')
      ) {
        newArr = (value as number[]).filter((v) => v !== valueToRemove);
      } else {
        console.warn(
          `Type mismatch: expected 'string' or 'number', got ${typeof valueToRemove}`,
        );
        return;
      }
      setValue(newArr);
      onChange(newArr);
      if (newArr.length === 0) {
        setCurrentOption(options);
      }
    }

    const handleInputChange = (valueLabel: string) => {
      const newValue = options.filter((option) =>
        option.label
          .toLowerCase()
          .trim()
          .includes(valueLabel.toLowerCase().trim()),
      );

      setCurrentOption(newValue);
    };

    function renderBadges() {
      if (!value.length) return <span>{legend}</span>;
      return value.map((v) => {
        const optionItem = options.find((option) => option.value === v);
        // eslint-disable-next-line react/jsx-no-bind
        return <BadgeItem key={v} option={optionItem} onRemove={removeValue} />;
      });
    }

    return (
      <div ref={ref} className="w-full">
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
                {renderBadges()}
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
                onValueChange={(output) => handleInputChange(output)}
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
                            (optionElement) =>
                              optionElement.label === currentValue,
                          )?.value;

                          if (!selectedValue) {
                            return;
                          }

                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          value.includes(selectedValue as never)
                            ? removeValue(selectedValue)
                            : pushValue(selectedValue);
                        }}
                      >
                        {option.label}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            value.includes(option.value as never)
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
      </div>
    );
  },
);
MultiSelect.displayName = 'MultiSelect';
export default MultiSelect;
