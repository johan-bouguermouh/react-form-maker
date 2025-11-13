import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
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

    function useValue(option: string | Option): string | number {
      return isOption(option) ? option.value : option;
    }

    function useLabel(option: string | Option) {
      return isOption(option) ? option.label : option;
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onSelect(useValue(option));
      }
    };

    return (
      <div
        id={id}
        ref={ref}
        className={TileSelectorItemStyle}
        role="radio"
        aria-disabled={disabled}
        aria-checked={isSelected}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (disabled) return;
          onSelect(useValue(option));
        }}
        onKeyDown={(e) => handleKeyDown(e)}
      >
        <div className="flex items-center justify-center w-6 h-6 mr-2">
          {icon
            ? icon
            : isSelected && (
                <Check className="w-4 h-4 text-primary-foreground" />
              )}
        </div>
        {useLabel(option)}
      </div>
    );
  },
);

export default TileSelectorItem;
