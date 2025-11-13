import type { CustomInputFieldElementParams } from './ReactFormMaker/interfaces/CustomInputFieldElementParams';
import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type DatePickerCustomType = {
  disabled: Date[];
};

const DatePickerCustom = React.forwardRef<
  HTMLButtonElement,
  CustomInputFieldElementParams<DatePickerCustomType>
>(({ zFields, fieldProps, props }, ref) => {
  const [date, setDate] = React.useState<Date | undefined>();

  if (!fieldProps || !zFields || !props) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild className={cn(fieldProps.className)}>
        <Button
          ref={ref}
          variant="outline"
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date ? format(date, 'PPP') : <span>{fieldProps.placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectDate) => {
              setDate(selectDate);
              zFields.onChange(selectDate);
            }}
            disabled={props.disabled}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});
DatePickerCustom.displayName = 'DatePickerCustom';

export default DatePickerCustom;
