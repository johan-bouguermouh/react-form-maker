# React Form Maker 🚀

> 🇫🇷 **Version française**: [README.fr.md](./README.fr.md)

**A powerful and intuitive form builder for React applications with TypeScript support and Zod validation.**

## ✨ Features

- 🎯 **Fluent API** - Chain methods for clean, readable code
- 🔒 **Type Safety** - Full TypeScript support with intelligent autocompletion
- ✅ **Zod Integration** - Automatic validation with custom error messages
- 🎨 **Shadcn/ui Components** - Modern, accessible UI components
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔧 **Highly Customizable** - Adapt to your design system
- 🚀 **Easy Installation** - One command setup with automatic dependencies

## 🚀 Quick Start

### Installation

```bash
npx react-form-maker@latest
```

This command will:

- ✅ Detect your project type (Next.js, Vite, etc.)
- ✅ Install required dependencies
- ✅ Set up Shadcn/ui components
- ✅ Create utility files
- ✅ Copy ReactFormMaker components

### Basic Usage

```tsx
import { ReactFormMaker } from "@/components/ReactFormMaker/ReactFormMaker";
import { Field, FieldSet } from "@/components/ReactFormMaker/FormFields/Class";

const firstName = new Field("firstName")
  .text()
  .setLabel("First Name")
  .setPlaceholder("Enter your first name");

const lastName = new Field("email")
  .text()
  .setLabel("Email")
  .setValidation(z.string().email("Please enter a valid email"));

const accountType = new Field("accountType")
  .select(["Personal", "Business", "Other"])
  .setLabel("Account Type")
  .setDefaultValues("Personal");

const userInfo = new FieldSet("user-info", { legend: "User Information" }, [
  firstName,
  lastName,
  accountType,
]);

function MyForm() {
  const handleSubmit = (data, error) => {
    if (error) {
      console.error("Form errors:", error);
      return;
    }
    console.log("Form data:", data);
  };

  return <ReactFormMaker formfields={[userInfo]} onSubmit={handleSubmit} />;
}
```

## Introduction

React Form Maker is a tool designed to simplify the creation of forms that are often simple and repetitive. It's based on a straightforward JSON approach with useful information for inserting fields linked to the form.

React Form Maker combines the power of **React Hook Form** & **Zod** to ensure robust state management while integrating form validation. React Form Maker is built on **ShadCn** and the **Radix UI** library, giving every developer the ability to modify the behavior and UI of their components at the root level.

### Why this project?

ReactFormMaker was born from the observation that integrating libraries like **Shadcn UI**, **Radix UI**, **React Hook Form**, and **Zod** often leads to very verbose JSX, especially when you want to benefit from coherent UI, advanced context management, and robust validation. A simple form field can quickly take up 6 to 10 lines of code, making the code difficult to maintain and factor.

### **Philosophy**

This project aims to:

- **Normalize the UI** of forms through reusable and coherent components.
- **Centralize business logic** and field configuration in objects or JSON, rather than in JSX.
- **Reduce the amount of code to write** for each form, while keeping the power of React Hook Form and Zod for context management and validation.
- **Facilitate customization** and management of complex cases (conditional fields, advanced validations, etc.) without complicating JSX code.

### **Key concepts**

**React Form Maker** adopts a **configuration-driven UI** pattern: the entire form is described by business configuration, allowing dynamic generation of intelligent and coherent components, while keeping business logic centralized and factored.

**ReactFormMaker** proposes an architecture where business configuration drives form generation, while relying on a solid and normalized UI base thanks to shadcn/ui. This approach guarantees coherent, customizable, and easy-to-maintain forms, while limiting JSX code verbosity.

## 📚 Field Types

### Text Fields

```tsx
new Field("name").text();
new Field("email").text().setValidation(z.string().email());
new Field("password").password();
new Field("description").textarea();
new Field("phone").phoneNumber();
```

### Selection Fields

```tsx
new Field("country").select(["US", "UK", "FR"]);
new Field("skills").multiSelect(skillOptions);
new Field("gender").radio(["Male", "Female", "Other"]);
new Field("newsletter").checkbox();
new Field("notifications").switch();
```

### Advanced Fields

```tsx
new Field("birthDate").date("past");
new Field("avatar").file();
new Field("documents").fileDropZone();
new Field("preferences").tileSelector(options);
```

## 🎯 Advanced Features

### Custom Validation

```tsx
new Field("username").text().setValidation(
  z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
);
```

### Event Handlers

```tsx
new Field("email").text().handlerChange((e) => {
  // Access form context
  if (e.form.getValues("newsletter")) {
    // Update related fields
    e.form.setValue("emailFrequency", "weekly");
  }
});
```

### Conditional Fields

```tsx
new Field("hasExperience").switch().handlerChange((e) => {
  const hasExp = e.target.checked;
  e.form.setValue("experienceYears", hasExp ? 1 : 0);
});
```

## 🛠️ Configuration

### Field Configuration

```tsx
new Field("name")
  .text()
  .setLabel("Full Name")
  .setPlaceholder("Enter your full name")
  .setDefaultValues("John Doe")
  .setConfig({
    className: "col-span-2",
    required: true,
  });
```

### FieldSet Organization

```tsx
new FieldSet(
  "personal-info",
  {
    legend: "Personal Information",
    className: "grid grid-cols-2 gap-4",
  },
  [
    // Fields here will be organized in the fieldset
  ],
);
```

## Project Organization

The project's functioning is built around **four main stages**:

1. **Form configuration definition**
   The developer creates a configuration object describing the form fields, their types, validations, and options.

2. **Analysis and preparation by React Hook Form hook**
   This configuration object is transmitted to a custom hook based on React Hook Form. This hook:
   - Analyzes the configuration,
   - Dynamically generates the appropriate Zod validation schema,
   - Prepares all necessary attributes for proper form functioning (default values, validation, etc.).

3. **Dynamic JSX component generation**
   Fields are then automatically generated, according to the order and depth defined in the configuration.
   A generic component handles wrapping each field with the expected structure and attributes, to guarantee UI coherence and flexibility.

4. **Form rendering and context exposure**
   The final form is rendered with all fields correctly connected to React Hook Form.
   The form context is exposed, allowing developers to manipulate or listen to form data outside JSX if needed.

### ❓ Do dynamically generated forms make React rendering heavier or less performant?

Our library relies on a modular and optimized architecture, inspired by React and React Hook Form best practices, to guarantee:

- **Performant rendering**, even with complex or large forms,
- **Total field independence**: modifying one field doesn't trigger re-rendering of others.

#### **1. Dynamic generation, but static structure for React**

Even if the form is generated from configuration (object or array), the final result is classic JSX tree. React makes no difference between a "hand-written" form and a dynamically generated form: it only sees the final JSX.

#### **2. Advanced use of React Hook Form context**

Each field is connected to the React Hook Form context. This allows:

- Managing each field's state and validation in isolation,
- Re-rendering only the concerned field when a value changes,
- Avoiding global form re-renders.

#### **3. Field component optimization**

- **Each field component is encapsulated in `React.memo`**: it only re-renders if its own props change.
- **Callbacks (handlers, mapping, etc.) are memoized with `useCallback`** to avoid recreating functions on each render.
- **Calculated values (e.g., option lists)** are memoized with `useMemo` to avoid unnecessary recalculations.

#### **4. Decoupling and granularity**

- The component tree is divided so that each field, or group of fields, is independent.
- Wrappers and fieldsets are also optimized to not propagate unnecessary re-renders.

#### **5. Result: no rendering interdependence**

Thanks to this architecture:

- **Modifying a field doesn't cause re-rendering of other fields**,
- **The form remains fluid and performant**, even with many fields or complex validations,
- **Dynamic generation has no negative impact on performance** compared to a static form.

## Style Management Policy

The majority of form fields rely on the **ShadCN** component library, itself based on **Tailwind CSS**.
The goal is to centralize style management to guarantee coherence and maintainability, while allowing the possibility of handling exceptions when needed.

### Best practices for style customization

1. **Centralization via Tailwind configuration**
   Favor customizing your styles in the `tailwind.config.ts` (or `postcss.config.mjs`) file.
   This allows applying global and coherent modifications to the entire UI.

2. **Override ShadCN components**
   If customization via Tailwind isn't enough, you can directly modify components generated by ShadCN in the `ui` folder (created during installation).

3. **Project-specific components**
   Some components are specific to this project: you can adjust their style directly in the `ReactFormMaker/enhancements` folder.

4. **Punctual customization via `className`**
   For very specific needs, each field accepts a `className` prop that allows overriding style at the component level.
   This prop uses the `cn` utility function (from ShadCN, based on `clsx` and `twMerge`), allowing dynamic merging and conditioning of CSS classes.

## FieldFactory, an asset to simplify code

In many form generators, initial configuration is often done in JSON format. While this approach is universal and flexible, it quickly reaches its limits:

- Complex forms become difficult to read and maintain,
- Business logic (validation, dynamic behaviors) becomes scattered or duplicated,
- The absence of strong typing and autocompletion tools hurts code robustness.

**FieldFactory** addresses these issues by proposing an object-oriented class for defining form fields.

It serves as the foundation for specialized classes (e.g., `TextField`, `PasswordField`, etc.), allowing:

- Fluid and readable configuration through method chaining (`.setLabel()`, `.isEmail()`, etc.),
- Automatic application of Zod schemas adapted to each field type, facilitating validation and security,
- Easy extension: each field type can have its own class, encapsulating its specific rules and behaviors,
- Better developer experience: autocompletion, strong typing, integrated documentation.

### Usage and utility

**FieldFactory** allows you to:

- **Define form fields in a declarative and expressive way**
  Rather than manipulating large JSON objects, you can build your fields with fluid and readable syntax:

  ```typescript
  const emailField = new TextField("email")
    .setLabel("Email address")
    .isEmail()
    .setPlaceholder("Enter your email");
  ```

- **Centralize business logic and validation**
  Each specialized class (e.g., `TextField`) embeds its own validation rules (Zod), which avoids duplication and guarantees business rule coherence.

- **Facilitate maintenance and evolution**
  Adding a new field type or validation rule becomes trivial: just extend the base class or add a method.

- **Benefit from strong typing and advanced autocompletion**
  Thanks to TypeScript, using `FieldFactory` and its derivatives offers an optimal developer experience: fewer errors, more productivity, and documentation directly in the IDE.

- **Make configuration evolutionary**
  For simple needs, JSON configuration remains possible. But for complex forms, the object-oriented approach allows going much further, without sacrificing readability.

## 📦 Dependencies

React Form Maker automatically installs these dependencies:

- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod integration
- `zod` - Schema validation
- `@radix-ui/*` - UI component primitives
- `tailwindcss` - Styling (if not present)

## 🌟 Examples

Check out the [test pages](./frontend/src/app/field-tests) for comprehensive examples of each field type with increasing complexity.

## 📖 Detailed Documentation

For more in-depth documentation on using the `ReactFormMaker` component, field configuration, available props, style customization, advanced aspects, and complete examples, please consult the [detailed documentation](./frontend/src/components/ReactFormMaker/DOCUMENTATION.md).

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## 📄 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ for the React community**
