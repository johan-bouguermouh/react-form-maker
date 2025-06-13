import Field from '@/components/ReactFormMaker/FormFields/Class/FieldFactory/FieldFactory.class';
import {
  FieldReactFormMaker,
  ReactFormMakerFieldset,
} from '@/components/ReactFormMaker/interfaces/FieldInterfaces';
import { FormFieldEvent } from '@/components/ReactFormMaker/interfaces/FormFieldEvent';
import { z } from 'zod';

const defaultText = z
  .string()
  .min(2, {
    message: 'Ce champ doit contenir au moins 2 caractères.',
  })
  .max(255, {
    message: 'Ce champ doit contenir au maximum 50 caractères.',
  });

export const UseTchessi = () => {
  // You can use the Field class to create a field directly
  const addressInput = new Field('address')
    .text(defaultText)
    .setConfig({
      label: 'Adresse',
      placeholder: '123 rue de la rue',
    })
    .handlerBlur((e) => {
      console.log('blur', e);
    });

  //you can make it also directly in constructor,
  //if you are familiar with the json aspect of the object is more readable on over
  // when you have a lot of fields, you can look directly the configuration of the field
  const cityInput = new Field('city', {
    label: 'Ville',
    inputType: 'text',
    zodObject: z.string().min(2, {
      message: 'Ville doit contenir au moins 2 caractères.',
    }),
  });

  // and add after your custom configuration if you want but you can't look directly the configuration of the field on over :/
  cityInput.setConfig({
    placeholder: 'Paris',
  });
  //or your custom handler :
  //__ Your custom handler
  const myCustomHandler: (e: FormFieldEvent) => void = (e) => {
    console.log(e);
    // in handler you have acces of form context of ReactHookForm and you can change value hors other informations has you want
  };
  //__ Add your custom handler to the field
  cityInput.handlerChange(myCustomHandler);

  // The zodObject can be ignored if, is case a simple zodShema is used by default, in this case the method générate un simple zodShema
  const tileSelectorCity = new Field('city').tileSelector([
    'Paris',
    'Marseille',
    'Lyon',
  ]);
  //__ if you need to refine zod shema you can link method to the field
  tileSelectorCity.zodObject?.optional();

  //you can choose value of other input depending of the value of the current input
  tileSelectorCity.handlerClick((e) => {
    //you can use the form context to change value of other input
    const { city } = e?.form?.getValues() || { city: undefined };
    let cityValue: number | undefined;
    switch (city) {
      case 'Paris':
        cityValue = 75000;
        break;
      case 'Marseille':
        cityValue = 13000;
        break;
      case 'Lyon':
        cityValue = 69000;
        break;
      default:
        cityValue = undefined;
        break;
    }
    if (cityValue) {
      e?.form?.setValue('zipCode', cityValue);
    }
  });

  const bithDateInput = new Field('birethDate').date({
    type: 'olderThan',
    value: {
      years: 18,
    },
  });

  const zipCodeInput = new Field('zipCode').number();

  zipCodeInput.zodObject = z.string().min(5, {
    message: 'Zip Code must be at least 5 characters.',
  });

  const fields: FieldReactFormMaker[] = [
    addressInput,
    cityInput,
    tileSelectorCity,
    zipCodeInput,
    bithDateInput,
  ];
  const formShema: ReactFormMakerFieldset[] = [
    {
      fieldset: 'presonalData',
      legend: 'Vos Coordonée Personnels',
      legendClassName: 'text-green-500 font-bold mb-[42px]',
      fields: fields,
    },
  ];

  return {
    formShema,
  };
};
