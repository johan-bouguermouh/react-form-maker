'use client';

import { CodeBlock } from '@/components/CodeBlock';
import FieldSet from '@/components/ReactFormMaker/FormFields/Class/Fieldset.class';
import { TextField } from '@/components/ReactFormMaker/FormFields/Class/TextFields.class';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import { H3, H4, Lead, P } from '@/components/ui/Typography';
import Link from 'next/link';

export default function TestTextPage() {
  type FormData = {
    simpleText: string;
  };

  const textField = new TextField('namefield').setLabel('Insert a simple text');
  const fieldSet = new FieldSet(
    'simpleFieldset',
    {
      legend: 'Try simple TextField class',
    },
    [textField],
  );
  return (
    <div className="max-w-2xl w-full mx-auto">
      <H3>TextField Class</H3>
      <p className="my-4">
        The TextField class, extending{' '}
        <Link href="#" className="text-primary underline font-semibold">
          FieldFactory
        </Link>
        ,The goal is to avoid manually creating JSON structures and instead
        centralize field configuration within dedicated objects. This improves
        readability, reduces duplicated code, and ensures consistent field
        definitions across the application. TextField also serves as a
        foundation for generating, validating, and sharing more advanced field
        definitions.
      </p>
      <hr className="my-4" />
      <H4 className="my-4" id="basic-usage">
        Basic Usage
      </H4>
      <Lead className="my-4 text-xs">
        TextField uses method chaining, each setter returns the field itself.
        This lets you build and customize fields in a single, readable line,
        making form setup fast and flexible.
      </Lead>
      <CodeBlock src="./src/app/test-simple/text/page.tsx">
        {`const yourField = new TextField("namefield")
  .setLabel("Simple Text Field");`}
      </CodeBlock>

      <ReactFormMaker<FormData>
        formfields={[fieldSet]}
        onSubmit={(data, error) => {
          if (error) return;
          if (!data) return;
          console.log('Données du formulaire:', data);
          alert(`Formulaire soumis ! Vérifiez la console.
      ${JSON.stringify(data, null, 2)}
      `);
        }}
        className="p-4 bg-white rounded-xl shadow-md"
        btnTextSubmit="Tester"
      />
    </div>
  );
}
