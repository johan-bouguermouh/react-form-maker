import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { FieldParams } from '../interfaces/FieldParams';

const InputPasswordVisibility = React.forwardRef(
  ({ zFields, fieldProps, indexField, id }: FieldParams) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputValue: string =
      zFields.value !== undefined ? String(zFields.value) : '';

    return (
      <div className={cn('flex flex-row items-center', fieldProps.className)}>
        <Input
          id={id ?? fieldProps.inputName}
          className="rounded-[var(--radius)_0px_0px_var(--radius)] w-[calc(100%_-_49px)] border-r-[none]"
          key={indexField}
          type={showPassword ? 'text' : 'password'}
          placeholder={fieldProps.placeholder}
          {...zFields}
          value={inputValue}
        />
        <Button
          className="rounded-[0px_var(--radius)_var(--radius)_0px]"
          variant="outline"
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </Button>
      </div>
    );
  },
);
InputPasswordVisibility.displayName = 'InputPasswordVisibility';

export default InputPasswordVisibility;
