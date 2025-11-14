import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  isOption,
  type Option,
} from '../../utils/typeGuards/optionsFields.TypeGuards';

interface TileSelectorItemProps {
  option: string | Option;
  isSelected: boolean;
  onSelect: (value: string | number) => void;
  className?: string;
  id?: string | undefined;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const TileSelectorItem = forwardRef<HTMLDivElement, TileSelectorItemProps>(
  ({ option, isSelected, onSelect, className, id, disabled, icon }, ref) => {
    const TileSelectorItemStyle = cn(
      'w-full flex flex-row items-center justify-start p-4 border border-gray-300 rounded-md cursor-pointer mb-2 shadow-sm transition-colors',
      {
        'bg-primary text-primary-foreground hover:bg-primary/90': isSelected,
      },
      {
        'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground':
          !isSelected,
      },
      {
        'cursor-not-allowed opacity-50': disabled,
      },
      className,
    );

    function getValue(option: string | Option): string | number {
      return isOption(option) ? option.value : option;
    }

    function getLabel(option: string | Option) {
      return isOption(option) ? option.label : option;
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onSelect(getValue(option));
      }
    };

    return (
      <div
        id={id}
        ref={ref}
        className={TileSelectorItemStyle}
        role="option"
        aria-disabled={disabled}
        aria-checked={isSelected}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (disabled) return;
          onSelect(getValue(option));
        }}
        onKeyDown={(e) => handleKeyDown(e)}
        aria-selected={isSelected}
      >
        <div className="flex items-center justify-center w-6 h-6 mr-2">
          {icon ||
            (isSelected && (
              <Check className="w-4 h-4 text-primary-foreground" />
            ))}
        </div>
        {getLabel(option)}
      </div>
    );
  },
);

TileSelectorItem.displayName = 'TileSelectorItem';

export default TileSelectorItem;
