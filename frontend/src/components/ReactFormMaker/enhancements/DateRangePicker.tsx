'use client';

import * as React from 'react';
import type {
  DateRange,
  DayPickerProps,
  DropdownProps,
} from 'react-day-picker';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format, getYear, set, formatDistance } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FieldParams } from '../interfaces/FieldParams';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import YearsDropdownCustom from './YearsDropdown';

export function DateRangePicker({ zFields, fieldProps }: FieldParams) {
  const [date, setDate] = React.useState<DateRange>({
    from: fieldProps?.defaultValues?.from || addDays(new Date(), 1),
    to: fieldProps?.defaultValues?.to || addDays(new Date(), 2),
  });
  const [selectedYearFrom, setSelectedYearFrom] = React.useState<number>(
    getYear(new Date()),
  );
  const [selectedYearTo, setSelectedYearTo] = React.useState<number>(
    getYear(new Date()),
  );
  const dateEndMouth = set(new Date(), { month: 11, date: 31 });
  dateEndMouth.setFullYear(dateEndMouth.getFullYear() + 100);

  const modifiers: DayPickerProps['modifiers'] = {
    selected: date,
    range_start: date.from,
    range_end: date.to,
    range_middle: (day: Date) =>
      date && date.from && date.to ? day > date.from && day < date.to : false,
  };

  React.useEffect(() => {
    zFields.onChange(date);
  }, [date]);

  function onDayClickHandler(day: Date, range: 'from' | 'to') {
    if (range === 'from') {
      if (date?.from && day.toString() == date?.from.toString()) {
        setDate({ ...date, from: undefined });
      } else {
        setDate({ ...date, from: day });
      }
    } else if (date?.to && day.toString() == date?.to.toString()) {
      setDate({ ...date, to: undefined });
    } else {
      setDate({ ...date, to: day });
    }
  }

  return (
    <div className={cn('grid gap-2', fieldProps.className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="space-y-2 p-2 flex flex-row justify-between">
            <div className="mt-2">
              <h5 className="w-full text-center scroll-m-20 leading-7 text-xl font-semibold tracking-tight  m-2">
                Selected start date
              </h5>
              <Calendar
                pagedNavigation
                captionLayout="dropdown-years"
                endMonth={dateEndMouth}
                modifiers={modifiers}
                onDayClick={(day) => onDayClickHandler(day, 'from')}
                numberOfMonths={1}
                components={{
                  Chevron: ({ ...props }) =>
                    props.orientation === 'left' ? (
                      <ChevronLeft {...props} className="h-4 w-4" />
                    ) : (
                      <ChevronRight {...props} className="h-4 w-4" />
                    ),
                  YearsDropdown: (props: DropdownProps) => {
                    return (
                      <YearsDropdownCustom
                        {...props}
                        range="from"
                        selectedYear={selectedYearFrom}
                        setSelectedYear={setSelectedYearFrom}
                      />
                    );
                  },
                }}
              />
            </div>
            <div>
              <h5 className="w-full text-center scroll-m-20 text-xl font-semibold tracking-tight m-2">
                Selected end date
              </h5>
              <Calendar
                pagedNavigation
                captionLayout="dropdown-years"
                endMonth={dateEndMouth}
                onDayClick={(day) => onDayClickHandler(day, 'to')}
                modifiers={modifiers}
                numberOfMonths={1}
                components={{
                  Chevron: ({ ...props }) =>
                    props.orientation === 'left' ? (
                      <ChevronLeft {...props} className="h-4 w-4" />
                    ) : (
                      <ChevronRight {...props} className="h-4 w-4" />
                    ),
                  YearsDropdown: (props: DropdownProps) => {
                    return (
                      <YearsDropdownCustom
                        {...props}
                        range="to"
                        selectedYear={selectedYearTo}
                        setSelectedYear={setSelectedYearTo}
                      />
                    );
                  },
                }}
              />
            </div>
          </div>
          <div className="flex justify-center w-full mb-4">
            <span className="text-sm text-muted-foreground">
              {date && date.from && date.to
                ? `The selected time slot is ${formatDistance(
                    date.from,
                    date.to,
                  )}`
                : 'Choose a date range'}
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
