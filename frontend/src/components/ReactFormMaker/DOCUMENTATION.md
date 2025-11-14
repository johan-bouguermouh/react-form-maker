# React Form Maker Documentation

## Introduction

React Form Maker is a tool designed to simplify the creation of simple and repetitive forms. It is based on a straightforward JSON approach, where all the necessary information for inserting form fields is provided in a configuration object.
React Form Maker leverages the power of React Hook Form & Zod to ensure robust state management and integrated form validation.
React Form Maker is built on ShadCn and the Radix UI library, allowing every developer to customize the behavior and UI of their components at the root level.

## Philosophy

This project aims to:

- **Standardize the UI** of forms using reusable and consistent components.
- **Centralize business logic** and field configuration in objects or JSON, rather than in JSX.
- **Reduce the amount of code to write** for each form, while retaining the power of React Hook Form and Zod for context management and validation.
- **Facilitate customization** and the handling of complex cases (conditional fields, advanced validations, etc.) without making JSX code more complex.

## Key Concepts

**React Form Maker** adopts a **configuration-driven UI** pattern: the entire form is described by a business configuration, enabling dynamic generation of smart and consistent components, while keeping business logic centralized and factored.

**ReactFormMaker** offers an architecture where business configuration drives form generation, relying on a solid and normalized UI foundation thanks to shadcn/ui.
This approach ensures forms are consistent, customizable, and easy to maintain, while limiting JSX code verbosity.

## Using the `ReactFormMaker` Component

### Component Props

Here is the list of props accepted by the `ReactFormMaker` component:

- **`formfields`**
  - Type: `CompositeField[]`
  - Required: Yes
  - Description: An array of form field definitions used to generate the form. Each object in the array configures a field or a group of fields (fieldset).
  - Example:
    ```typescript
    const formfields = [
      {
        name: 'username',
        type: 'text',
        label: 'Username',
        validation: { required: true },
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        validation: { required: true, isEmail: true },
      },
    ];
    ```

- **`onSubmit`**
  - Type: `(data: T | false, errors: FieldErrors<T> | false) => void`
  - Required: Yes
  - Description: Callback function triggered on form submission. It receives the form data if validation succeeds, or the errors if validation fails.
  - Example:
    ```typescript
    function handleSubmit(data, errors) {
      if (data) {
        console.log('Form submitted successfully:', data);
      } else {
        console.error('Validation errors:', errors);
      }
    }
    ```

- **`className`**
  - Type: `string`
  - Required: Optional
  - Description: Optional CSS class for the form container. Allows you to customize the form style.

- **`footerClassName`**
  - Type: `string`
  - Required: Optional
  - Default value: `'flex justify-end gap-4'`
  - Description: Optional CSS class for the form footer section, where action buttons are usually placed.

- **`children`**
  - Type: `React.ReactNode`
  - Required: Optional
  - Description: Optional React children to render inside the form. Useful for inserting custom elements or additional action buttons in the footer.

- **`btnTextSubmit`**
  - Type: `string`
  - Required: Optional
  - Default value: `'Submit'`
  - Description: Text to display on the main submit button of the form.

- **`btnSubmitClassName`**
  - Type: `string`
  - Required: Optional
  - Description: Optional CSS class for the main submit button.

- **`stepper`**
  - Type: `boolean`
  - Required: Optional
  - Default value: `false`
  - Description: If `true`, the form will be rendered as a stepper (multi-step form). Each top-level `fieldset` in `formfields` will be treated as a step.

- **`orientation`**
  - Type: `'horizontal' | 'vertical'`
  - Required: Optional
  - Default value: `'horizontal'`
  - Description: Sets the orientation of the stepper (horizontal or vertical). Used only if `stepper` is `true`.

### Usage Examples

#### Simple Example with Basic Fields

```tsx
import ReactFormMaker from './ReactFormMaker'; // Adjust the import path
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Make sure to import Zod

const MyForm = () => {
  const formFieldsDefinition = [
    {
      inputName: 'firstName',
      inputType: 'text',
      label: 'First Name',
      zodObject: z.string().min(1, 'First name is required'),
    },
    {
      inputName: 'lastName',
      inputType: 'text',
      label: 'Last Name',
      zodObject: z.string().min(1, 'Last name is required'),
    },
    {
      inputName: 'age',
      inputType: 'number',
      label: 'Age',
      zodObject: z.number().min(18, 'You must be at least 18 years old'),
    },
  ];

  const handleSubmit = (data: FieldValues) => {
    console.log('Submitted data:', data);
  };

  return (
    <ReactFormMaker
      formfields={formFieldsDefinition}
      onSubmit={handleSubmit}
      btnTextSubmit="Send"
      className="my-custom-form"
    />
  );
};

export default MyForm;
```

#### Example with Custom Children

You can pass buttons or other React elements as children. They will be rendered in the form footer. If a `submit` button is passed as a child, the default submit button will not be displayed.

```tsx
import ReactFormMaker from './ReactFormMaker'; // Adjust the import path
import { Button } from '@/components/ui/button'; // Make sure you have a Button component
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Make sure to import Zod

const FormWithCustomFooter = () => {
  const formFieldsDefinition = [
    {
      inputName: 'feedback',
      inputType: 'textarea',
      label: 'Your feedback',
      zodObject: z.string().max(200, 'Maximum 200 characters'),
    },
  ];

  const handleSubmit = (data: FieldValues) => {
    console.log('Feedback submitted:', data);
  };

  const handleReset = () => {
    // Logic to reset the form (requires access to the form instance)
    console.log('Form reset');
  };

  return (
    <ReactFormMaker formfields={formFieldsDefinition} onSubmit={handleSubmit}>
      <Button type="submit" variant="secondary">
        Submit Feedback
      </Button>
      <Button type="button" variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </ReactFormMaker>
  );
};

export default FormWithCustomFooter;
```

#### Example with `stepper` Mode

To use the stepper mode, you need to structure `formfields` with objects implementing `ReactFormMakerStep` (which are essentially `ReactFormMakerFieldset` objects with additional stepper properties).

```tsx
import ReactFormMaker from './ReactFormMaker'; // Adjust the import path
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Make sure to import Zod

const StepperFormExample = () => {
  const stepperFormFields = [
    {
      stepName: 'step1', // ReactFormMakerStep property
      isStep: true, // ReactFormMakerStep property
      legend: 'Step 1: Personal Information',
      fields: [
        {
          inputName: 'username',
          inputType: 'text',
          label: 'Username',
          zodObject: z.string().min(1),
        },
        {
          inputName: 'email',
          inputType: 'email',
          label: 'Email',
          zodObject: z.string().email(),
        },
      ],
    },
    {
      stepName: 'step2',
      isStep: true,
      legend: 'Step 2: Address',
      fields: [
        {
          inputName: 'address',
          inputType: 'text',
          label: 'Address',
          zodObject: z.string().min(1),
        },
        {
          inputName: 'city',
          inputType: 'text',
          label: 'City',
          zodObject: z.string().min(1),
        },
      ],
    },
    {
      stepName: 'step3',
      isStep: true,
      legend: 'Step 3: Confirmation',
      fields: [
        {
          inputName: 'confirm',
          inputType: 'checkbox',
          label: 'I confirm my information',
          zodObject: z.boolean().refine((val) => val === true),
        },
      ],
    },
  ];

  const handleSubmit = (data: FieldValues) => {
    console.log('Stepper data submitted:', data);
  };

  return (
    <ReactFormMaker
      formfields={stepperFormFields}
      onSubmit={handleSubmit}
      stepper={true}
      orientation="vertical" // or "horizontal"
      btnTextSubmit="Finish"
    />
  );
};

export default StepperFormExample;
```

## Form Field Configuration

The `formfields` prop is essential for `ReactFormMaker`. It is an array of objects that defines the structure and behavior of your form. Each object in this array can be an individual field, a group of fields (fieldset), a separator, or a form step (if `stepper` is enabled).

### `CompositeField` Interface

`CompositeField` is a base interface that most other field configurations inherit from. It provides common properties for composable form elements.

| Property    | Type                                                                                    | Description                                                                                            |
| :---------- | :-------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `classname` | `string` (optional)                                                                     | CSS class for styling the element.                                                                     |
| `fields`    | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]` (optional) | An array of child elements (fields, dividers, or fieldsets). Recommended for `ReactFormMakerFieldset`. |
| `isHide`    | `boolean` (optional)                                                                    | If `true`, hides the element. Useful for conditionally hiding fields.                                  |

### `FieldReactFormMaker` Interface

This interface defines a standard form field (input, select, etc.). It inherits from `CompositeField`.

| Property                  | Type                                                       | Required | Description                                                                                                                                       |
| :------------------------ | :--------------------------------------------------------- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `inputName`               | `string`                                                   | Yes      | Unique name of the field, used as the key in the form data.                                                                                       |
| `label`                   | `string`                                                   | Optional | Text displayed above or beside the field.                                                                                                         |
| `placeholder`             | `string`                                                   | Optional | Placeholder text displayed in the field when empty.                                                                                               |
| `inputType`               | `InputType`                                                | Yes      | Type of field to display (see "Field Types (`InputType`)" below).                                                                                 |
| `zodObject`               | `ZodType<any>`                                             | Optional | Zod validation schema for this field. Recommended for robust validation.                                                                          |
| `defaultValues`           | `any`                                                      | Optional | Default value of the field.                                                                                                                       |
| `options`                 | `string[] \| { value: string \| number; label: string }[]` | Optional | Options for `select`, `radio`, `checkbox`, `tileSelector`, `tileMultiSelector` fields. Required if `inputType` is one of these types.             |
| `className`               | `string`                                                   | Optional | CSS class to style the field element itself.                                                                                                      |
| `disabled`                | `boolean`                                                  | Optional | If `true`, disables the field.                                                                                                                    |
| `description`             | `string`                                                   | Optional | Descriptive text displayed under or beside the field to provide additional information.                                                           |
| `isSecure`                | `boolean`                                                  | Optional | If `true`, masks the field (e.g., for password fields, though `isHide` is more common for dynamic hiding).                                        |
| `onChange`                | `(event: FormFieldEvent) => void`                          | Optional | Callback function executed when the field value changes. The `event` object contains a `form` property to interact with the form state.           |
| `onBlur`                  | `(event: FormFieldEvent) => void`                          | Optional | Callback function executed when the field loses focus.                                                                                            |
| `onSelect` (or `onFocus`) | `(event: FormFieldEvent) => void`                          | Optional | Callback function executed when the field gains focus.                                                                                            |
| `onClick`                 | `(event: FormFieldEvent) => void`                          | Optional | Callback function executed on a click on the field (relevant for certain field types).                                                            |
| `customInputFieldElement` | `React.ReactNode`                                          | Optional | Allows replacing the default rendering of the field with a custom React component. Must be a valid field element compatible with React Hook Form. |
| `children`                | `React.ReactNode`                                          | Optional | React children to display inside the field structure (e.g., after the field itself but before the description).                                   |
| `props`                   | `Record<string, any>`                                      | Optional | Additional properties to pass directly to the underlying HTML input element.                                                                      |

#### Field Types (`InputType`)

| Type                 | Description                                                                              |
| :------------------- | :--------------------------------------------------------------------------------------- |
| `text`               | Standard text input field.                                                               |
| `password`           | Password input field (masks characters).                                                 |
| `select`             | Dropdown list for single selection. Requires `options` prop.                             |
| `selectAutocomplete` | Dropdown list with autocomplete. Requires `options` prop.                                |
| `multiSelect`        | Dropdown list for multiple selections. Requires `options` prop.                          |
| `textarea`           | Multi-line text area.                                                                    |
| `date`               | Date picker.                                                                             |
| `dateRange`          | Date range picker.                                                                       |
| `radio`              | Radio buttons for single selection among multiple options. Requires `options` prop.      |
| `checkbox`           | Single checkbox (for a boolean value) or group of checkboxes (if `options` is provided). |
| `switch`             | Toggle switch (usually for a boolean value).                                             |
| `file`               | Standard file upload field.                                                              |
| `fileDropZone`       | Drag-and-drop area for file uploads.                                                     |
| `number`             | Numeric input field.                                                                     |
| `custom`             | Used when providing a `customInputFieldElement`.                                         |
| `tileSelector`       | Tile selector for single selection. Requires `options` prop.                             |
| `tileMultiSelector`  | Tile selector for multiple selections. Requires `options` prop.                          |
| `phoneNumber`        | Phone number input (may include specific formatting).                                    |

### `DividerReactFormMaker` Interface

Used to insert separators or non-interactive structuring elements in the form. Inherits from `CompositeField`.

| Property    | Type                                                                         | Required | Description                                                                      |
| :---------- | :--------------------------------------------------------------------------- | :------- | :------------------------------------------------------------------------------- |
| `isDiv`     | `boolean`                                                                    | Yes      | Must be `true`. Indicates that this element is a divider/structural container.   |
| `className` | `string`                                                                     | Optional | CSS class for styling the divider.                                               |
| `isHide`    | `boolean`                                                                    | Optional | If `true`, hides the divider.                                                    |
| `fields`    | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]` | Optional | Allows nesting other elements inside this divider, creating a grouped structure. |
| `children`  | `JSX.Element`                                                                | Optional | Custom JSX content to display inside the divider.                                |

### `ReactFormMakerFieldset` Interface

Allows logically grouping fields under a common title (`legend`). Inherits from `CompositeField`.

| Property          | Type                                                                         | Required | Description                                                                         |
| :---------------- | :--------------------------------------------------------------------------- | :------- | :---------------------------------------------------------------------------------- |
| `fieldset`        | `string`                                                                     | Yes      | Unique name for the fieldset (mainly for internal organization, not for form data). |
| `legend`          | `string`                                                                     | Optional | Title displayed for the group of fields.                                            |
| `legendClassName` | `string`                                                                     | Optional | CSS class for styling the legend.                                                   |
| `className`       | `string`                                                                     | Optional | CSS class for styling the fieldset element.                                         |
| `fields`          | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]` | Optional | Array of nested fields, dividers, or fieldsets within this group.                   |
| `isHide`          | `boolean`                                                                    | Optional | If `true`, hides the entire fieldset.                                               |

### `ReactFormMakerStep` Interface

Defines a step in a "stepper" form. This interface inherits from `CompositeField` and shares many properties with `ReactFormMakerFieldset`, but adds step-specific functionalities. It is used when the `stepper` prop of `ReactFormMaker` is set to `true`.

| Property                | Type                                                                                             | Required | Description                                                                                                                                                                                |
| :---------------------- | :----------------------------------------------------------------------------------------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stepName`              | `string`                                                                                         | Yes      | Unique name of the step, used for identification and navigation.                                                                                                                           |
| `isStep`                | `boolean`                                                                                        | Optional | Must be `true` to indicate that this element is a step in the stepper.                                                                                                                     |
| `legend`                | `string`                                                                                         | Optional | Title of the step, displayed at the top of the step.                                                                                                                                       |
| `legendClassName`       | `string`                                                                                         | Optional | CSS class for styling the step legend.                                                                                                                                                     |
| `className`             | `string`                                                                                         | Optional | CSS class for styling the step container.                                                                                                                                                  |
| `fields`                | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]`                     | Optional | Array of fields, dividers, or fieldsets contained in this step.                                                                                                                            |
| `isHide`                | `boolean`                                                                                        | Optional | If `true`, hides the step.                                                                                                                                                                 |
| `children`              | `React.ReactNode`                                                                                | Optional | Custom React children to display in the step content.                                                                                                                                      |
| `disabledBefore`        | `boolean`                                                                                        | Optional | If `true` (default `false`), disables the "Previous" button and navigation to previous steps via the stepper header.                                                                       |
| `isStrict`              | `boolean`                                                                                        | Optional | If `true` (default `false`), the user cannot proceed to the next step until all fields in the current step are valid according to their `zodObject`.                                       |
| `onBeforeNextStep`      | `(data: { submissionState: StepFormState<any>; form: UseFormReturn<any>; }) => Promise<boolean>` | Optional | Asynchronous function executed before proceeding to the next step (after validation). Must return `true` to allow proceeding, `false` to prevent it. Allows for advanced validation logic. |
| `IconStep`              | `React.ComponentType<any>`                                                                       | Optional | Custom React component for the step icon in the stepper's progress indicator.                                                                                                              |
| `buttonNextContent`     | `string`                                                                                         | Optional | Custom text for the "Next" button of this step.                                                                                                                                            |
| `buttonPreviousContent` | `string`                                                                                         | Optional | Custom text for the "Previous" button of this step.                                                                                                                                        |
| `additionalButtons`     | `React.ReactNode`                                                                                | Optional | Additional JSX elements (e.g., buttons) to display in the step footer, after the standard navigation buttons.                                                                              |
| `footerClassName`       | `string \| string[]`                                                                             | Optional | CSS class(es) for styling the step footer.                                                                                                                                                 |

### Field Configuration Examples

```typescript
import { z } from 'zod'; // Make sure to import Zod for examples

export const formFieldsExamples = [
  // 1. Simple text field
  {
    inputName: 'username',
    label: 'Username',
    inputType: 'text',
    placeholder: 'Enter your username',
    zodObject: z
      .string()
      .min(3, 'Username must be at least 3 characters long.'),
    description: 'Your public username.',
  },

  // 2. Select field with options
  {
    inputName: 'country',
    label: 'Country',
    inputType: 'select',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'ca', label: 'Canada' },
      { value: 'us', label: 'United States' },
    ],
    zodObject: z.string().nonempty('Please select a country.'),
    defaultValues: 'fr',
  },

  // 3. Checkbox field
  {
    inputName: 'subscribe',
    label: 'Subscribe to newsletter',
    inputType: 'checkbox',
    zodObject: z.boolean(),
    defaultValues: true,
  },

  // 4. Group of checkboxes (options for the same inputName)
  {
    inputName: 'interests',
    label: 'Your interests',
    inputType: 'checkbox',
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'sport', label: 'Sport' },
      { value: 'music', label: 'Music' },
    ],
    zodObject: z
      .array(z.string())
      .min(1, 'Please select at least one interest.'),
    description: 'Check all that apply.',
  },

  // 5. Using ReactFormMakerFieldset to group fields
  {
    fieldset: 'userProfile', // Fieldset name
    legend: 'User Profile',
    className: 'user-profile-fieldset',
    fields: [
      {
        inputName: 'firstName',
        label: 'First Name',
        inputType: 'text',
        zodObject: z.string().min(1, 'First name is required.'),
      },
      {
        inputName: 'lastName',
        label: 'Last Name',
        inputType: 'text',
        zodObject: z.string().min(1, 'Last name is required.'),
      },
    ],
  },

  // 6. Using ReactFormMakerStep (for a form with stepper={true})
  // This would be an element of the main `formfields` array
  {
    stepName: 'personalInfo',
    isStep: true,
    legend: 'Personal Information',
    fields: [
      {
        inputName: 'fullName',
        label: 'Full Name',
        inputType: 'text',
        zodObject: z.string().min(2, 'Full name is required.'),
      },
      {
        inputName: 'birthDate',
        label: 'Date of Birth',
        inputType: 'date',
        zodObject: z
          .date()
          .refine((date) => date < new Date(), 'Date must be in the past.'),
      },
    ],
    // Step-specific properties
    isStrict: true,
    buttonNextContent: 'Next: Address',
  },
];
```

## Programmatic Field Definition with `FieldFactory`

In many form generators, the initial configuration is often done in JSON format (or JavaScript literal objects). While this approach is universal and flexible, it quickly reaches its limits:

- Complex forms become hard to read and maintain.
- Business logic (validation, dynamic behaviors) gets scattered or duplicated.
- The lack of strong typing and autocompletion tools harms code robustness.

**`FieldFactory`** addresses these issues by offering an object-oriented approach to defining form fields. It serves as a base class for specialized classes (e.g., `TextField`, `SelectField`, `PasswordField`, etc.), providing several advantages :

- **Fluent and Readable Configuration** : Thanks to method chaining, field configuration becomes more declarative and expressive.
  ```typescript
  const emailField = new TextField('email')
    .setLabel('Email Address')
    .isEmail() // Specific method for email validation
    .setPlaceholder('Enter your email')
    .setRequired('Email is required.');
  ```
- **Centralized Business Logic and Validation** : Each specialized class (e.g., `TextField`) can encapsulate its own Zod validation rules and behavior logics. For example, the `.isEmail()` method on a `TextField` instance could automatically set up the appropriate `zodObject` for email validation. This avoids duplication and ensures consistency.
- **Easier Extensibility** : Adding a new field type or validation rule becomes simpler. You just need to create a new class inheriting from `FieldFactory` (or another field class) or add a new method to an existing class.
- **Better Developer Experience** : Using classes and TypeScript provides strong typing, advanced autocompletion in IDEs, and integrated documentation via TSDoc, reducing errors and increasing productivity.
- **Scalable Configuration** : For simple needs, literal object configuration remains possible. But for complex forms, the object-oriented approach with `FieldFactory` allows for deeper structuring without sacrificing readability or maintainability.

### Usage and Utility

`FieldFactory` and its derived classes allow you to :

1.  **Define form fields in a declarative and expressive way.**
2.  **Centralize business logic and validation** within field classes.
3.  **Facilitate maintenance and evolution** of form configuration.
4.  **Benefit from strong typing and advanced autocompletion.**

### Example Usage with `TextField`

The `TextField` class (located in `frontend/src/components/ReactFormMaker/FormFields/Class/TextFields.class.ts`) is an example of a class derived from `FieldFactory`. Here is how to use it to define text fields and integrate them into `ReactFormMaker` :

```typescript
// Make sure the import path is correct
import { TextField } from './frontend/src/components/ReactFormMaker/FormFields/Class/TextFields.class';
import ReactFormMaker from './frontend/src/components/ReactFormMaker/ReactFormMaker'; // Adjust the path
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Import Zod for other fields if necessary

// Define fields using the TextField class
const usernameField = new TextField('username') // 'username' is the inputName
  .setLabel('Username')
  .setPlaceholder('Your unique username')
  .setRequired('Username is required.') // Applies a simple Zod validation
  .setMinLength(5, 'Must be at least 5 characters long.');

const emailField = new TextField('userEmail')
  .setLabel('Email Address')
  .isEmail() // Applies the Zod validation for email and sets a default placeholder
  .setRequired('Email is required.');

const websiteField = new TextField('userWebsite')
  .setLabel('Website (optional)')
  .isUrl() // Applies the Zod validation for URL and a onSelect behavior
  .setZodObject(z.string().url().optional()); // Allows overriding or refining the ZodObject

// The configured field objects can be directly used in formfields.
// The FieldFactory class's .getConfig() method returns the FieldReactFormMaker object.
const myFormFields = [
  usernameField.getConfig(),
  emailField.getConfig(),
  websiteField.getConfig(),
  // You can still mix with literal configuration objects
  {
    inputName: 'age',
    inputType: 'number',
    label: 'Age',
    zodObject: z.number().min(18)
  }
];

const MyComponentUsingFieldFactory = () => {
  const handleSubmit = (data: FieldValues) => {
    console.log('Form data:', data);
  };

  return (
    <ReactFormMaker
      formfields={myFormFields}
      onSubmit={handleSubmit}
      btnTextSubmit="Submit"
    />
  );
};

export default MyComponentUsingFieldFactory;
```

This approach promotes better organization and reusability of your form field configuration, especially for large applications.

## Style Customization

Most form fields and the `ReactFormMaker` component itself rely on the **ShadCN/UI** component library, which is based on **Tailwind CSS**. The goal is to centralize style management to ensure consistency and maintainability, while offering multiple levels of customization to adapt to specific needs.

### Best practices for style customization

Here are the recommended approaches to customize the appearance of your forms:

1.  **Centralization via Tailwind configuration (`tailwind.config.ts`)**
    - **Description** : This is the preferred method for global and consistent modifications. By adjusting your `tailwind.config.ts` (or `tailwind.config.js`, `postcss.config.mjs` depending on your setup), you can redefine primary colors, fonts, spacings, etc., that will be applied across your entire UI, including ShadCN components used by `ReactFormMaker`.
    - **Advantage** : Maintains stylistic consistency throughout your application.

2.  **Overriding ShadCN/UI components (in the `ui` folder)**
    - **Description** : When you initialize ShadCN/UI in your project (via `npx shadcn-ui@latest init`), the components you choose to use (like `Button`, `Input`, `Select`, etc.) are added to your code base, typically in a `components/ui` folder. `ReactFormMaker` uses these components. You can directly modify the code of these components for more specific adjustments that may not be possible via Tailwind configuration alone.
    - **Advantage** : Fine control over the appearance and behavior of base components.
    - **Note** : Be aware that if you update ShadCN components via their CLI (`add` for an existing component), your local changes may be overwritten. Manage these components as part of your source code.

3.  **Adjusting styles of project-specific components (`ReactFormMaker/enhancements` and others)**
    - **Description** : `ReactFormMaker` may contain internal components or "enhancements" that are not directly raw ShadCN/UI components. If these components have their own style files or allow style props, you can adjust them there. The exact path may vary, but explore the `ReactFormMaker` folder structure for such components.
    - **Advantage** : Targets specific elements to the logic of `ReactFormMaker`.

4.  **One-off customization via the `className` prop**
    - **Description** :
      - **On the `ReactFormMaker` component** : The `className` prop allows applying Tailwind (or global CSS) classes to the main container of the form. The `footerClassName` specifically targets the footer of the form.
      - **On field definitions (`formfields`)** : Each field object in the `formfields` array (whether a `FieldReactFormMaker`, `ReactFormMakerFieldset`, etc.) can accept a `className` (or `classname` for `CompositeField` and its derivatives like `ReactFormMakerFieldset`, `legendClassName` for fieldset legends). These classes are applied to the wrapper element of the field or to the specific element.
    - **Using `cn`** : It is recommended to use a utility function like `cn` (often provided by ShadCN/UI, based on `clsx` and `tailwind-merge`) to build your `className` strings. `cn` intelligently merges Tailwind classes, handles conditional classes, and avoids class conflicts.
      ```typescript
      // Example in field configuration
      {
        inputName: 'email',
        inputType: 'text',
        label: 'Email',
        className: cn('border-blue-500', { 'bg-gray-100': isDisabled })
      }
      ```
    - **Advantage** : Ideal for specific adjustments to a field or form without affecting others. Very flexible for dynamic changes based on state.

By combining these approaches, you can achieve precise control over the appearance of your forms generated by `ReactFormMaker`, while maintaining a consistent and easy-to-manage style base.

## Advanced Aspects

This section covers more advanced features of `ReactFormMaker`, intended for users looking to extend or deeply customize the behavior of their forms.

### Custom Hooks

`ReactFormMaker` internally uses several React hooks to manage its logic. While direct use is generally not necessary for most use cases, knowing them can be useful for advanced extension or debugging scenarios.

- **`useReactFormMaker<T extends FieldValues>(formfieldsAttributes: CompositeField[])`**
  - **Role** : This hook is at the core of form generation. It takes the `formfields` configuration, initializes `react-hook-form` (including generating the Zod schema from fields' `zodObject` and managing default values), and returns the form instance (`form`), the generated Zod schema (`formSchema`), default values (`dataFieldsDefaultValues`), the raw Zod object (`zObject`), and a utility function `hasSubmitButton` to detect if a submit button is already present among the children.
  - **Main utility** : Manages all the initialization logic of `react-hook-form` and transforms the `formfields` configuration into a usable Zod schema. Mainly used internally by the `ReactFormMaker` component.

- **`useFormHandlers<T extends FieldValues>({ onSubmit: (data, errors) => void })`**
  - **Role** : This hook simplifies handling `react-hook-form` submit callbacks. It takes a single `onSubmit` function (the one you pass to `ReactFormMaker`) and splits it into two handlers: `onValid` (for successful submissions) and `onInvalid` (for submissions failed due to validation errors).
  - **Main utility** : Provides the `onValid` and `onInvalid` functions that `react-hook-form` expects for its own `handleSubmit` function. Used internally to wire your `onSubmit` callback to `react-hook-form`'s submit system.

- **`useFormFieldsMap<T extends FieldValues>(form: UseFormReturn<T>)`**
  - **Role** : This hook is responsible for the recursive rendering of form fields and fieldsets. It returns functions (`FormFieldsMap`, `FieldsetMap`) that iterate over the `formfields` configuration and display the appropriate field components (like `FormFieldElement`, `DivElementField`) or fieldsets. It also returns `InpuTComponentCallBack`, a memoized function to render the `InputComponent` used for each field.
  - **Main utility** : Manages the mapping logic of field configuration to rendered JSX elements. This is the dynamic rendering engine of the fields. Mainly for internal use.

These hooks encapsulate the complexity of integrating with `react-hook-form` and the dynamic rendering logic. To extend `ReactFormMaker`, it is generally better to create custom field types or use the existing configuration props rather than interacting directly with these hooks, unless you are building a very specific form functionality.

### Event Handling on Fields

You can attach event handlers directly to your fields when configuring them in the `formfields` array. Common events like `onChange`, `onBlur`, and `onClick` are supported.

These callback functions receive a `FormFieldEvent` object that contains two properties :

- `event`: The raw browser event (e.g., `React.ChangeEvent<HTMLInputElement>`, `React.FocusEvent<HTMLInputElement>`).
- `form`: The complete `react-hook-form` instance (`UseFormReturn<T>`). This gives you direct access to all methods of `react-hook-form` (like `setValue`, `getValue`, `trigger`, `formState`, etc.) inside your event handler.

For the exact signature and more details on `FormFieldEvent`, refer to the documentation of the `FieldReactFormMaker` interface (see "Events" section).

#### Example using `onChange`

```typescript
import { FormFieldEvent } from './frontend/src/components/ReactFormMaker/interfaces/FormFieldEvent'; // Adjust the path
import { FieldValues } from 'react-hook-form';
import { z } from 'zod';

// Suppose TFormData is your form data type
interface TFormData extends FieldValues {
  firstName: string;
  lastName?: string;
  hasNickname?: boolean;
  nickname?: string;
}

const handleFirstNameChange = (fieldEvent: FormFieldEvent<TFormData>) => {
  const { event, form } = fieldEvent;
  const newValue = (event.target as HTMLInputElement).value;

  console.log(`First name is now: ${newValue}`);

  // Example of interacting with react-hook-form :
  // Dynamically update another field
  form.setValue('lastName', newValue + ' Smith');

  // Trigger validation for another field
  if (newValue.length > 2) {
    form.trigger('lastName');
  }
};

const handleNicknameVisibility = (fieldEvent: FormFieldEvent<TFormData>) => {
  const { event, form } = fieldEvent;
  const isChecked = (event.target as HTMLInputElement).checked;
  // You could use form.setValue to show/hide or enable/disable the nickname field
  // or just manage it locally if the nickname field is conditionally rendered
  console.log(`Show nickname: ${isChecked}`);
  if (!isChecked) {
    form.setValue('nickname', ''); // Clear nickname if unchecked
    form.unregister('nickname'); // Optional: unregister the field so it's not submitted
  } else {
    form.register('nickname'); // Register the field if it was unregistered
  }
};

export const formFieldsWithEvents: Array<FieldReactFormMaker> = [
  {
    inputName: 'firstName',
    inputType: 'text',
    label: 'First Name',
    zodObject: z.string().min(1),
    onChange: handleFirstNameChange,
  },
  {
    inputName: 'hasNickname',
    inputType: 'checkbox',
    label: 'Do you have a nickname?',
    onChange: handleNicknameVisibility,
    zodObject: z.boolean().optional(),
  },
  {
    inputName: 'nickname',
    inputType: 'text',
    label: 'Nickname (if applicable)',
    // This field could be hidden/shown conditionally based on 'hasNickname'
    // using the 'isHide' property and updating it via form.setValue in handleNicknameVisibility,
    // or by managing it in the JSX rendering of your component.
    // For this example, we assume it's always visible but its value is managed.
    zodObject: z.string().optional(),
  },
  // ... other fields
];

// Then use formFieldsWithEvents in <ReactFormMaker formfields={formFieldsWithEvents} ... />
```

In this example, `handleFirstNameChange` is called whenever the value of the "firstName" field changes. It has access to the browser event and the complete `react-hook-form` instance, allowing for complex logics and interactions between fields. Similarly, `handleNicknameVisibility` reacts to the checkbox changes to potentially manipulate the visibility or state of the "nickname" field.
