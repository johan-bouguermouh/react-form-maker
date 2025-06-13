import Field from './FieldFactory/FieldFactory.class';
import {
  FieldReactFormMaker,
  ReactFormMakerFieldset,
} from '../../interfaces/FieldInterfaces';
import { z } from 'zod';
import { FormFieldEvent } from '../../interfaces/FormFieldEvent';

export class TextField extends Field<FieldReactFormMaker> {
  constructor(name: string, config?: Partial<FieldReactFormMaker>) {
    super(name);

    this.text();
    if (config) {
      const currentConfig = this.getConfig();
      this.setConfig({ ...currentConfig, ...config });
    }
    return this;
  }

  useRegex(regex: RegExp): this {
    if (!this.zodObject) {
      console.warn('You must set a zod object before using this method');
      return this;
    }
    this.zodObject = this.zodObject.refine((data) => regex.test(data), {
      message: 'Invalid input',
    });
    return this;
  }

  isEmail(): this {
    if (!this.zodObject) {
      this.zodObject;
    }
    this.setPlaceholder('Email');
    this.zodObject = z.string().email({
      message: 'Invalid email',
    });
    return this;
  }

  isUrl(): this {
    if (!this.zodObject) {
      this.zodObject;
    }

    this.zodObject = z.string().url({
      message: 'Invalid url',
    });

    this.onSelect = (e: FormFieldEvent) => {
      if (!e.target.value) {
        e.target.value = 'https://';
      }
    };
    return this;
  }

  isPassword(): this {
    this.password();
    this.setPlaceholder('********');
    return this;
  }

  /**
   * Add a second fieldText to confirm the password.
   *
   * This method is used to create a password confirmation field.
   *
   * /!\ You must call this method after calling `password()` to set the zodObject.
   * @returns
   */
  confirmPassword(
    config?: Partial<Omit<FieldReactFormMaker, 'inputName'>>,
  ): Field<FieldReactFormMaker> {
    if (!this.zodObject) {
      this.zodObject;
    }
    if (!this.inputType || this.inputType !== 'password') {
      throw new Error(
        'You must call password() before calling confirmPassword()',
      );
    }

    //this.Children(ConfirmPasswordField);

    const initialPasswordField = this.getConfig();

    /**
     * config?: Partial<FieldReactFormMaker>
     */
    const defaultconfig: FieldReactFormMaker = {
      inputName: 'confirmPassword',
      className: 'form-input',
      placeholder: '*********',
      inputType: 'password',
      zodObject: z.string(),
    };

    const newField = new Field(`passwordWrapper`, {
      isDiv: true,
      className: 'flex flex-col',
      fields: [
        initialPasswordField as FieldReactFormMaker,
        {
          ...defaultconfig,
          ...config,
        },
      ],
    });
    return newField;
  }
}
