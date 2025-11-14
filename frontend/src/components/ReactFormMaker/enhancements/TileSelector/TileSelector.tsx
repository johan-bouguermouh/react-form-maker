import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useGenerateUUIDs } from '@/lib/useGenerateUUIDs';
import TileSelectorItem from './TileSelectorItem';
import {
  isOption,
  type Option,
} from '../../utils/typeGuards/optionsFields.TypeGuards';

interface TileSelectorProps {
  options: string[] | Option[];
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onClick?: (value: string | number) => void;
  value?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  defaultValue: string;
  legend?: string;
  label?: string;
  itemClassName?: string;
  className?: string;
  id?: string;
  excludes?: string[] | number[];
}

const TileSelector = forwardRef<HTMLDivElement, TileSelectorProps>(
  (props, ref) => {
    const {
      options,
      onClick,
      defaultValue,
      className,
      disabled,
      id,
      legend,
      itemClassName,
      excludes,
    } = props;
    const [selectedValue, setSelectedValue] = useState<string | number | null>(
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
      const option = options.find(
        (item) => (isOption(item) ? item.label : item) === value,
      );
      if (!option) {
        return;
      }

      const newValue =
        value === selectedValue
          ? null
          : isOption(option)
            ? option.value
            : option;

      if (!newValue) {
        setSelectedValue(null);
        return;
      }

      setSelectedValue(newValue);
      if (onClick && newValue) {
        onClick(newValue);
      }
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
      return selectedValue === (isOption(item) ? item.value : item);
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
          const itemValue = isOption(item) ? item.value : item;
          function isExcluded() {
            return excludes && excludes.includes(itemValue as never);
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
              id={`tileSelectorItem-${itemValue}`}
            />
          );
        })}
      </div>
    );
  },
);

TileSelector.displayName = 'TileSelector';

export default TileSelector;
