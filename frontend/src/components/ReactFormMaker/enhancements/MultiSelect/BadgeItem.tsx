import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Cross1Icon } from '@radix-ui/react-icons';
import { type Option } from '../../utils/typeGuards/optionsFields.TypeGuards';

export interface BadgeItemParams extends React.ComponentProps<'div'> {
  option: Option | undefined;
  onRemove: (value: string | number) => void;
  className?: string;
}

const BadgeItem = forwardRef<HTMLDivElement, BadgeItemParams>((props, ref) => {
  const { option, onRemove, className, ...rest } = props;

  const [isHovered, setIsHovered] = React.useState(false);

  if (!option) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-row items-center justify-between px-2 break-words py-1 rounded-lg text-primary-background border border-input bg-background shadow-sm gap-2 transition-colors w-full max-w-full',
        { 'bg-accent': isHovered },
        className,
      )}
    >
      {option && option.label}
      <button
        className={cn(
          'flex item-center justify-center rounded-full bg-muted text-primary-background h-3 w-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition',
          { 'bg-accent text-accent-foreground scale-110 ': isHovered },
        )}
      >
        <Cross1Icon
          className={cn('w-3 h-3')}
          onClick={() => onRemove(option.value)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </button>
    </div>
  );
});

BadgeItem.displayName = 'BadgeItem';

export default BadgeItem;
