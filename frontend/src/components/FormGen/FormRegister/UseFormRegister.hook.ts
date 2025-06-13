import Field from '@/components/ReactFormMaker/FormFields/Class/FieldFactory/FieldFactory.class';
import data from './exemple.data';
import FieldSet from '@/components/ReactFormMaker/FormFields/Class/Fieldset.class';
import DatePickerCustom from '@/components/DatePickerCustom';
import { FieldReactFormMaker } from '@/components/ReactFormMaker/interfaces/FieldInterfaces';
import { z } from 'zod';
import { TextField } from '@/components/ReactFormMaker/FormFields/Class/TextFields.class';
import React from 'react';

const disabledDates = [
  //yesterday
  new Date(new Date().setDate(new Date().getDate() - 1)),
  //tomorrow
  new Date(new Date().setDate(new Date().getDate() + 1)),
];

export const UseFormRegister = () => {
  const email = new TextField('email')
    .isEmail()
    .setLabel('Email')
    .setPlaceholder('Email');
  const password = new TextField('password').isPassword().confirmPassword();
  const firstName = new TextField('firstName').setLabel('Prénom');
  const lastName = new TextField('lastName').setLabel('Nom');
  const dateOfBirth = new Field('birthDate').dateRange();
  const customDateRange = new Field('customDateRange')
    .date()
    .custom(DatePickerCustom, { disabled: disabledDates })
    .setPlaceholder('seleciotnnez une date');

  const simpleFields = new FieldSet('login', {}, [
    email,
    [firstName, lastName],
    dateOfBirth,
    password,
    customDateRange,
  ]);

  return {
    simpleFields,
    data,
  };
};
