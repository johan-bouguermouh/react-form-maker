import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { FieldParams } from '../interfaces/FieldParams';

const InputPasswordVisibility = React.forwardRef(
  (
    { zFields, fieldProps, indexField, className, id }: FieldParams,
    ref: React.Ref<any>,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputValue = zFields.value !== undefined ? zFields.value : '';

    return (
      <div className={`${fieldProps.className} flex flex-row items-center`}>
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
