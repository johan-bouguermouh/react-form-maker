import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { type ClassValue } from 'clsx';
import { cn } from '@/lib/utils';
import { useGenerateUUIDs } from '@/lib/useGenerateUUIDs';
import TileSelectorItem from './TileSelectorItem';
import {
  isOption,
  type Option,
} from '../../utils/typeGuards/optionsFields.TypeGuards';

export interface TileMultiSelectorProps {
  options: string[] | Option[];
  onSelect?: (values: string[] | number[]) => void;
  onChange?: (values: string[] | number[]) => void;
  onBlur?: (values: string[]) => void;
  value?: string[];
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  defaultValue: string[];
  legend?: string;
  label?: string;
  itemClassName?: string;
  className?: ClassValue[] | string | undefined;
  id?: string;
  excludes?: string[] | number[];
  icon?: React.ReactNode;
}

const TileMultiSelector = forwardRef<HTMLDivElement, TileMultiSelectorProps>(
  (props, ref) => {
    const {
      options,
      onSelect,
      onChange,
      defaultValue = [],
      className,
      disabled,
      id,
      legend,
      itemClassName,
      excludes,
    } = props;
    const [selectedValues, setSelectedValues] = useState<string[] | number[]>(
      defaultValue,
    );
    const [focusedIndex, setFocusedIndex] = useState(0);
    const uuids = useGenerateUUIDs(
      options.map((item) => (isOption(item) ? item.value : item)),
    );
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    function isChildFocused(
      activeElement: Element | null = document.activeElement,
    ) {
      return itemsRef.current.some((item) => item === activeElement);
    }

    const handleChange = (value: string | number) => {
      let newSelectedValues: string[] | number[] = [];
      if (selectedValues && selectedValues.includes(value as never)) {
        newSelectedValues = selectedValues.filter((v) => v !== value) as
          | string[]
          | number[];
      } else {
        newSelectedValues = [...selectedValues, value] as string[] | number[];
      }

      setSelectedValues(newSelectedValues);
      onSelect && onSelect(newSelectedValues);
      onChange && onChange(newSelectedValues);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isChildFocused) {
        return;
      }

      if (e.key === 'ArrowDown') {
        setFocusedIndex((prevIndex) => (prevIndex + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        setFocusedIndex(
          (prevIndex) => (prevIndex - 1 + options.length) % options.length,
        );
      } else if (e.key === 'Enter' || e.key === ' ') {
        const optionSelected = options[focusedIndex];
        handleChange(
          isOption(optionSelected) ? optionSelected.label : optionSelected,
        );
      }
    };

    useEffect(() => {
      itemsRef.current[focusedIndex]?.focus();
    }, [focusedIndex]);

    function isSelected(item: string | Option) {
      if (!selectedValues || !selectedValues.length) {
        return false;
      }
      return selectedValues.includes(
        (isOption(item) ? item.value : item) as never,
      );
    }

    return (
      <div
        ref={ref}
        id={id}
        aria-disabled={disabled}
        role="listbox"
        tabIndex={0}
        className={cn('flex flex-col p-4', className)}
        onKeyDown={handleKeyDown}
      >
        <legend className="text-sm font-semibold">{legend}</legend>
        {options.map((item, index) => {
          const itemValue = isOption(item) ? item.label : item;
          function isExcluded() {
            return (
              excludes &&
              excludes.includes(
                (isOption(itemValue) ? itemValue.value : itemValue) as never,
              )
            );
          }

          return (
            <TileSelectorItem
              disabled={disabled || isExcluded()}
              key={uuids[index]}
              option={item}
              isSelected={isSelected(item)}
              onSelect={handleChange}
              className={itemClassName}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              id={`tileMultiSelectorItem-${itemValue}`}
              icon={props.icon ?? null}
            />
          );
        })}
      </div>
    );
  },
);

TileMultiSelector.displayName = 'TileMultiSelector';

export default TileMultiSelector;
