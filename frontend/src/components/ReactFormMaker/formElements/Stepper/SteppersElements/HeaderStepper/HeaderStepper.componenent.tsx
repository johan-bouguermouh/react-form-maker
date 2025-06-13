import React from 'react';
import HeaderStepperItem from './HeaderStepperItem/HeaderStepperItem.component';
import { useHeaderStepper } from './HeaderStepper.hook';
import HeaderStepperStyle from './HeaderStepper.style';

/**
 * ### NavigationStepper Component
 *
 * The navigation bar varies according to the oriantation defined in the form.
 *
 * The navigation has been designed to be both perfectly responsive to the space allocated to it on the screen.
 *
 * #### Behavior
 *
 * Breakpoints are defined to adapt the size of the navigation bar to the space available on the screen.
 *
 * - if the space width can't contain name of the steps, the name will be hidden.
 * - If the space is less than 768px, the navigation bar will be horizontal.
 * - If the space is greater than 768px, the orientation will be respected.
 */
function NavigationStepper() {
  const { navRef, stepElements, steps, orientation, size } = useHeaderStepper();

  const styleProps = {
    orientation,
    size,
    stepsLength: steps.length,
  };

  const Style = new HeaderStepperStyle(styleProps);
  return (
    <nav ref={navRef} className={Style.navClass} style={Style.navStyle}>
      {steps.map((step, index) => {
        return (
          <HeaderStepperItem
            step={step}
            index={index}
            size={size}
            ref={(el) => {
              stepElements.current[index] = el;
            }}
          />
        );
      })}
    </nav>
  );
}

export default NavigationStepper;
