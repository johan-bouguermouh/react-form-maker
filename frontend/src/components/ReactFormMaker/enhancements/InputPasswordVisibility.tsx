import React from 'react';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import type { FieldParams } from '../interfaces/FieldParams';
import { cn, mergeRefs } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const InputPasswordVisibility = React.forwardRef<HTMLInputElement, FieldParams>(
  ({ zFields, fieldProps, indexField, id }, _ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const mergedRef = mergeRefs(_ref, zFields.ref);

    const inputValue: string =
      zFields.value !== undefined ? String(zFields.value) : '';

    return (
      <div className={cn('flex flex-row items-center', fieldProps.className)}>
        <Input
          id={id ?? fieldProps.inputName}
          className=" rounded-[var(--radius)_0px_0px_var(--radius)] w-[calc(100%_-_49px)] border-r-[none]"
          key={indexField}
          type={showPassword ? 'text' : 'password'}
          placeholder={fieldProps.placeholder}
          {...zFields}
          ref={mergedRef}
          value={inputValue}
        />
        <Button
          className="!rounded-[0px_var(--radius)_var(--radius)_0px] bg-white"
          variant="outline"
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </Button>
      </div>
    );
  },
);
InputPasswordVisibility.displayName = 'InputPasswordVisibility';

export default InputPasswordVisibility;
