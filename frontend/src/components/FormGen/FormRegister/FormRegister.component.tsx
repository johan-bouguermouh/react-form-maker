import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import React from 'react';
import { UseFormRegister } from './UseFormRegister.hook';

export default function FormRegister() {
  const { simpleFields, data } = UseFormRegister();

  return (
    <ReactFormMaker
      formfields={[simpleFields]}
      btnTextSubmit="S'inscrire"
      onSubmit={(values) => {
        console.log('values', values);
      }}
      className="
        flex flex-col gap-4 p-4 w-1/3 bg-white rounded-lg shadow-md border border-gray-300"
    />
  );
}
