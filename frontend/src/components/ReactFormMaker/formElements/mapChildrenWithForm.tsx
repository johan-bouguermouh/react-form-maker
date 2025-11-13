import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface FormEvent extends React.SyntheticEvent {
  form: any;
}

/**
 * Maps over the children components and injects the form object into event handlers.
 * - - -
 * @param childrenComponents - The children components to be processed.
 * @param form - The form object to be injected into event handlers.
 * @returns A new set of children components with the form object injected into their event handlers.
 */
const mapChildrenWithForm = (
  childrenComponents: React.ReactNode,
  form: UseFormReturn<any>,
): React.ReactNode =>
  React.Children.map(childrenComponents, (child) => {
    if (React.isValidElement(child)) {
      const newProps = { ...child.props };
      Object.keys(newProps).forEach((propName) => {
        if (typeof newProps[propName] === 'function') {
          const originalEventHandler = newProps[propName];
          newProps[propName] = (event: FormEvent) => {
            event.form = form;
            originalEventHandler(event);
          };
        }
      });
      return React.cloneElement(child, newProps);
    }
    return child;
  });

export default mapChildrenWithForm;
