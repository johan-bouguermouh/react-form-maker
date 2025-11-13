import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

const DatePickerSimple = React.forwardRef<HTMLButtonElement, FieldParams>(
  ({ zFields, fieldProps }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>();

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
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
DatePickerSimple.displayName = 'DatePickerSimple';

export default DatePickerSimple;
