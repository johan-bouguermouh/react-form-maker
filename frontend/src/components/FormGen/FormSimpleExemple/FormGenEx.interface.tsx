import { extendZodWithReactFormMaker } from '@/lib/zodRFM';
import { FieldValues } from 'react-hook-form';
import { z } from 'zod';

extendZodWithReactFormMaker(z);

export default interface FormDataExemple extends FieldValues {
  secretKey: number;
  username: string;
  DateRangePicker: {
    from: Date;
    to: Date;
  };
  FistName: string;
  LastName: string;
  BirthDate: Date;
  email: string;
  Password: string;
  validatePassword: string;
  Address: string;
  zipCode: string;
  city: string;
  typeOfAccount: 'free' | 'premium' | 'gold';
  newsletter: boolean;
  avatarFile: File;
  acceptTerms?: boolean;
}
