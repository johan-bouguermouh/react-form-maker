import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { DropdownOption, DropdownProps, useDayPicker } from 'react-day-picker';

export interface YearsDropdownProps extends DropdownProps {
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  range?: 'from' | 'to';
}

export interface DateRange {
  from: Date;
  to: Date;
}

export default function YearsDropdownCustom({
  selectedYear,
  setSelectedYear,
  range = 'from',
}: YearsDropdownProps) {
  const { goToMonth, selected } = useDayPicker();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedData: DateRange = selected ?? {
    from: new Date(),
    to: new Date(),
  };

  const currentYear = new Date().getFullYear();
  const decade = parseInt(`${currentYear.toString().slice(0, -1)}0`);

  const decades = Array.from({ length: 200 }, (_, i) => decade - 100 + i);

  const segementDecade: Array<DropdownOption[]> = decades.reduce(
    (acc: DropdownOption[][], year, index) => {
      if (index % 10 === 0) {
        acc.push([
          {
            value: year,
            label: year.toString(),
            disabled: false,
          },
        ]);
      } else {
        acc[acc.length - 1].push({
          value: year,
          label: year.toString(),
          disabled: false,
        });
      }
      return acc;
    },
    [],
  );

  function indexToStart(): number {
    const index = segementDecade.findIndex((decade) => {
      return decade.some((option) => {
        return option.value === selectedYear;
      });
    });
    return index;
  }

  return (
    <Popover
      onOpenChange={(e) => {
        setIsOpen(e);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost">
          {selectedYear}
          <ChevronDown
            orientation={isOpen ? 'up' : 'down'}
            className={cn(
              'h-4 w-4 transition-all transform duration-300 rotate-0',
              isOpen && 'transform rotate-180',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-10">
        <div className="bg-[white] w-[265px] items-center flexjustify-center p-3 acity-100 z-10 rounded-lg shadow-md border ">
          <Carousel
            opts={{
              align: 'start',
              startIndex: indexToStart(),
            }}
            className="w-[240px] max-w-sm"
          >
            <CarouselContent>
              {segementDecade.map((decade, index) => (
                <CarouselItem
                  key={index}
                  className="flex flex-row items-center justify-center w-full h-full flex-wrap m-2"
                >
                  {decade.map((option) => (
                    <Button
                      key={option.value}
                      onClick={(e) => {
                        const newDate = new Date(
                          option.value,
                          selectedData[range]?.getMonth() ||
                            new Date().getMonth(),
                        );
                        goToMonth(newDate);
                        setSelectedYear(option.value);
                      }}
                      variant="ghost"
                      className={cn(
                        'w-20 h-10',
                        option.value === selectedYear &&
                          'bg-primary text-primary-foreground',
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </PopoverContent>
    </Popover>
  );
}
