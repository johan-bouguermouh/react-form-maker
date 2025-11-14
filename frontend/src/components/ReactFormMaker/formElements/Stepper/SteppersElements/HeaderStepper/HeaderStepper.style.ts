import { cn } from '@/lib/utils';

interface StyleProps {
  orientation: string;
  size: { width: number; height: number };
  stepsLength: number;
}

/**
 * Class to manage the style of the stepper navigation
 * @class HeaderStepperStyle
 * @param {StyleProps} props - Props to manage the style of the stepper navigation
 * @property {string} navClass - Class to apply to the stepper navigation could be horizontal or vertical
 * @property {React.CSSProperties} navStyle - Style to apply to the stepper navigation could be width whene orientation is horizontal or height when orientation is vertical
 */
class HeaderStepperStyle {
  navClass: string;

  navStyle: React.CSSProperties;

  constructor(props: StyleProps) {
    this.navClass = cn({
      'flex flex-row items-center justify-between min-h-full sm:px-8 md:px-12 lg:px-24 xl:px-32 mb-4 sm:mb-[72px]':
        props.orientation === 'horizontal',
      'flex flex-col gap-2 min-w-[270px] h-full max-h-full overflow-y-auto justify-start scrollbar-gray':
        props.orientation !== 'horizontal',
    });

    this.navStyle =
      props.orientation === 'horizontal'
        ? {
            marginBottom:
              props.size.width / props.stepsLength - 12 > 80 ? '72px' : '12px',
          }
        : { width: props.size.width };
  }
}

export default HeaderStepperStyle;
