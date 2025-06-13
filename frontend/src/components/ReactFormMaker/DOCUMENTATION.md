# React Form Maker Documentation

## Introduction

React Form Maker est un outil destiné à faciliter le travail d'édition de formulaire simple et répétitif. Il se base sur un approche de JSON simple avec les informations utile à l'insertion des champs lier au formulaire.
React Form Maker allie la force de React Hook Form & Zod pour assurer un state mangement robuste tout en integrant un validation de formulaire.
React Form Maker est basé sur ShadCn et la librairie Radix Ui permettant à chaque développeur la possibiliter de modifier à la racine le comportement et l'UI de leurs composant.

## Philosophie

Ce projet vise à :

- **Normaliser l'UI** des formulaires grâce à des composants réutilisables et cohérents.
- **Centraliser la logique métier** et la configuration des champs dans des objets ou du JSON, plutôt que dans le JSX.
- **Réduire la quantité de code à écrire** pour chaque formulaire, tout en gardant la puissance de React Hook Form et Zod pour la gestion du contexte et la validation.
- **Faciliter la personnalisation** et la gestion de cas complexes (champs conditionnels, validations avancées, etc.) sans complexifier le code JSX.

## Concepts clés

**React Form Maker** adopte un pattern **configuration-driven UI **: l'intégralité du formulaire est décrite par une configuration métier, permettant de générer dynamiquement des composants intelligents et cohérents, tout en gardant la logique métier centralisée et factorisée.

**ReactFormMaker** propose une architecture où la configuration métier pilote la génération de formulaires, tout en s'appuyant sur une base UI solide et normalisée grâce à shadcn/ui.
Cette approche garantit des formulaires cohérents, personnalisables et faciles à maintenir, tout en limitant la verbosité du code JSX.

## Utilisation du Composant `ReactFormMaker`

### Props du Composant

Voici la liste des props acceptées par le composant `ReactFormMaker` :

- **`formfields`**
    - Type : `CompositeField[]`
    - Requis : Oui
    - Description : Un tableau de définitions de champs de formulaire utilisées pour générer le formulaire. Chaque objet dans le tableau configure un champ ou un groupe de champs (fieldset).
    - Exemple :
      ```typescript
      const formfields = [
        { name: 'username', type: 'text', label: 'Username', validation: { required: true } },
        { name: 'email', type: 'email', label: 'Email', validation: { required: true, isEmail: true } }
      ];
      ```

- **`onSubmit`**
    - Type : `(data: T | false, errors: FieldErrors<T> | false) => void`
    - Requis : Oui
    - Description : Fonction de rappel déclenchée lors de la soumission du formulaire. Elle reçoit les données du formulaire si la validation réussit, ou les erreurs si la validation échoue.
    - Exemple :
      ```typescript
      function handleSubmit(data, errors) {
        if (data) {
          console.log("Formulaire soumis avec succès:", data);
        } else {
          console.error("Erreurs de validation:", errors);
        }
      }
      ```

- **`className`**
    - Type : `string`
    - Requis : Optionnel
    - Description : Classe CSS optionnelle pour le conteneur du formulaire. Permet de personnaliser le style du formulaire.

- **`footerClassName`**
    - Type : `string`
    - Requis : Optionnel
    - Valeur par défaut : `'flex justify-end gap-4'`
    - Description : Classe CSS optionnelle pour la section du pied de page du formulaire, où se trouvent généralement les boutons d'action.

- **`children`**
    - Type : `React.ReactNode`
    - Requis : Optionnel
    - Description : Enfants React optionnels à rendre à l'intérieur du formulaire. Utile pour insérer des éléments personnalisés ou des boutons d'action supplémentaires dans le pied de page.

- **`btnTextSubmit`**
    - Type : `string`
    - Requis : Optionnel
    - Valeur par défaut : `'Submit'`
    - Description : Texte à afficher sur le bouton de soumission principal du formulaire.

- **`btnSubmitClassName`**
    - Type : `string`
    - Requis : Optionnel
    - Description : Classe CSS optionnelle pour le bouton de soumission principal.

- **`stepper`**
    - Type : `boolean`
    - Requis : Optionnel
    - Valeur par défaut : `false`
    - Description : Si `true`, le formulaire sera rendu sous forme de "stepper" (formulaire multi-étapes). Chaque `fieldset` de premier niveau dans `formfields` sera traité comme une étape.

- **`orientation`**
    - Type : `'horizontal' | 'vertical'`
    - Requis : Optionnel
    - Valeur par défaut : `'horizontal'`
    - Description : Définit l'orientation du stepper (horizontal ou vertical). Utilisé uniquement si `stepper` est à `true`.

### Exemples d'Utilisation

#### Exemple simple avec des champs de base

```tsx
import ReactFormMaker from './ReactFormMaker'; // Ajustez le chemin d'importation
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Assurez-vous d'importer Zod

const MyForm = () => {
  const formFieldsDefinition = [
    { inputName: 'firstName', inputType: 'text', label: 'Prénom', zodObject: z.string().min(1, 'Le prénom est requis') },
    { inputName: 'lastName', inputType: 'text', label: 'Nom', zodObject: z.string().min(1, 'Le nom est requis') },
    { inputName: 'age', inputType: 'number', label: 'Âge', zodObject: z.number().min(18, 'Vous devez avoir au moins 18 ans') }
  ];

  const handleSubmit = (data: FieldValues) => {
    console.log('Données soumises:', data);
  };

  return (
    <ReactFormMaker
      formfields={formFieldsDefinition}
      onSubmit={handleSubmit}
      btnTextSubmit="Envoyer"
      className="my-custom-form"
    />
  );
};

export default MyForm;
```

#### Exemple avec des enfants personnalisés

Vous pouvez passer des boutons ou d'autres éléments React comme enfants. Ils seront rendus dans le pied de page du formulaire. Si un bouton de type `submit` est passé comme enfant, le bouton de soumission par défaut ne sera pas affiché.

```tsx
import ReactFormMaker from './ReactFormMaker'; // Ajustez le chemin d'importation
import { Button } from '@/components/ui/button'; // Assurez-vous d'avoir un composant Button
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Assurez-vous d'importer Zod

const FormWithCustomFooter = () => {
  const formFieldsDefinition = [
    { inputName: 'feedback', inputType: 'textarea', label: 'Votre avis', zodObject: z.string().max(200, 'Maximum 200 caractères') }
  ];

  const handleSubmit = (data: FieldValues) => {
    console.log('Avis soumis:', data);
  };

  const handleReset = () => {
    // Logique pour réinitialiser le formulaire (nécessite accès à l'instance de formulaire)
    console.log('Formulaire réinitialisé');
  };

  return (
    <ReactFormMaker
      formfields={formFieldsDefinition}
      onSubmit={handleSubmit}
    >
      <Button type="submit" variant="secondary">Soumettre l'avis</Button>
      <Button type="button" variant="outline" onClick={handleReset}>Réinitialiser</Button>
    </ReactFormMaker>
  );
};

export default FormWithCustomFooter;
```

#### Exemple avec le mode `stepper`

Pour utiliser le mode stepper, vous devez structurer `formfields` avec des objets implémentant `ReactFormMakerStep` (qui sont essentiellement des `ReactFormMakerFieldset` avec des propriétés additionnelles pour le stepper).

```tsx
import ReactFormMaker from './ReactFormMaker'; // Ajustez le chemin d'importation
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Assurez-vous d'importer Zod

const StepperFormExample = () => {
  const stepperFormFields = [
    {
      stepName: 'step1', // Propriété de ReactFormMakerStep
      isStep: true,      // Propriété de ReactFormMakerStep
      legend: 'Étape 1: Informations personnelles',
      fields: [
        { inputName: 'username', inputType: 'text', label: 'Nom d\'utilisateur', zodObject: z.string().min(1) },
        { inputName: 'email', inputType: 'email', label: 'Email', zodObject: z.string().email() }
      ]
    },
    {
      stepName: 'step2',
      isStep: true,
      legend: 'Étape 2: Adresse',
      fields: [
        { inputName: 'address', inputType: 'text', label: 'Adresse', zodObject: z.string().min(1) },
        { inputName: 'city', inputType: 'text', label: 'Ville', zodObject: z.string().min(1) }
      ]
    },
    {
      stepName: 'step3',
      isStep: true,
      legend: 'Étape 3: Confirmation',
      fields: [
        { inputName: 'confirm', inputType: 'checkbox', label: 'Je confirme mes informations', zodObject: z.boolean().refine(val => val === true) }
      ]
    }
  ];

  const handleSubmit = (data: FieldValues) => {
    console.log('Données du stepper soumises:', data);
  };

  return (
    <ReactFormMaker
      formfields={stepperFormFields}
      onSubmit={handleSubmit}
      stepper={true}
      orientation="vertical" // ou "horizontal"
      btnTextSubmit="Finaliser"
    />
  );
};

export default StepperFormExample;
```

## Configuration des Champs de Formulaire

La prop `formfields` est essentielle pour `ReactFormMaker`. C'est un tableau d'objets qui définit la structure et le comportement de votre formulaire. Chaque objet dans ce tableau peut être un champ individuel, un groupe de champs (fieldset), un séparateur, ou une étape de formulaire (si `stepper` est activé).

### Interface `CompositeField`

`CompositeField` est une interface de base dont héritent la plupart des autres configurations de champs. Elle fournit des propriétés communes pour les éléments composables du formulaire.

| Propriété  | Type                                                                 | Description                                                                                                                               |
| :--------- | :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `classname`| `string` (optionnel)                                                 | Classe CSS pour styliser l'élément.                                                                                                       |
| `fields`   | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]` (optionnel) | Un tableau d'éléments enfants (champs, diviseurs, ou fieldsets). Recommandé pour `ReactFormMakerFieldset`.                                  |
| `isHide`   | `boolean` (optionnel)                                                | Si `true`, masque l'élément. Utile pour cacher des champs conditionnellement.                                                              |

### Interface `FieldReactFormMaker`

Cette interface définit un champ de formulaire standard (input, select, etc.). Elle hérite de `CompositeField`.

| Propriété                | Type                                                              | Requis    | Description                                                                                                                                                             |
| :----------------------- | :---------------------------------------------------------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputName`              | `string`                                                          | Oui       | Nom unique du champ, utilisé comme clé dans les données du formulaire.                                                                                                   |
| `label`                  | `string`                                                          | Optionnel | Texte affiché au-dessus ou à côté du champ.                                                                                                                              |
| `placeholder`            | `string`                                                          | Optionnel | Texte indicatif affiché dans le champ lorsqu'il est vide.                                                                                                             |
| `inputType`              | `InputType`                                                       | Oui       | Type de champ à afficher (voir la section "Types de Champs (`InputType`)" ci-dessous).                                                                                     |
| `zodObject`              | `ZodType<any>`                                                    | Optionnel | Schéma de validation Zod pour ce champ. Recommandé pour une validation robuste.                                                                                          |
| `defaultValues`          | `any`                                                             | Optionnel | Valeur par défaut du champ.                                                                                                                                               |
| `options`                | `string[] \| { value: string \| number; label: string }[]`        | Optionnel | Options pour les champs de type `select`, `radio`, `checkbox`, `tileSelector`, `tileMultiSelector`. Requis si `inputType` est l'un de ces types.                               |
| `className`              | `string`                                                          | Optionnel | Classe CSS pour styliser l'élément du champ lui-même.                                                                                                                    |
| `disabled`               | `boolean`                                                         | Optionnel | Si `true`, désactive le champ.                                                                                                                                          |
| `description`            | `string`                                                          | Optionnel | Texte descriptif affiché sous ou à côté du champ pour fournir des informations supplémentaires.                                                                         |
| `isSecure`               | `boolean`                                                         | Optionnel | Si `true`, masque le champ (par exemple, pour des raisons de sécurité, bien que `isHide` soit plus courant pour le masquage dynamique).                                  |
| `onChange`               | `(event: FormFieldEvent) => void`                                 | Optionnel | Fonction de rappel exécutée lorsque la valeur du champ change. L'objet `event` contient une propriété `form` pour interagir avec l'état du formulaire.                   |
| `onBlur`                 | `(event: FormFieldEvent) => void`                                 | Optionnel | Fonction de rappel exécutée lorsque le champ perd le focus.                                                                                                                |
| `onSelect` (ou `onFocus`) | `(event: FormFieldEvent) => void`                                 | Optionnel | Fonction de rappel exécutée lorsque le champ obtient le focus.                                                                                                             |
| `onClick`                | `(event: FormFieldEvent) => void`                                 | Optionnel | Fonction de rappel exécutée lors d'un clic sur le champ (pertinent pour certains types de champs).                                                                      |
| `customInputFieldElement`| `React.ReactNode`                                                 | Optionnel | Permet de remplacer le rendu par défaut du champ par un composant React personnalisé. Doit être un élément de champ valide compatible avec React Hook Form.                 |
| `children`               | `React.ReactNode`                                                 | Optionnel | Enfants React à afficher à l'intérieur de la structure du champ (par exemple, après le champ lui-même mais avant la description).                                         |
| `props`                  | `Record<string, any>`                                             | Optionnel | Propriétés supplémentaires à passer directement à l'élément d'input HTML sous-jacent.                                                                                   |

#### Types de Champs (`InputType`)

| Type                 | Description                                                                                                |
| :------------------- | :--------------------------------------------------------------------------------------------------------- |
| `text`               | Champ de saisie de texte standard.                                                                         |
| `password`           | Champ de saisie de mot de passe (masque les caractères).                                                   |
| `select`             | Liste déroulante pour une sélection unique. Nécessite la prop `options`.                                  |
| `selectAutocomplete` | Liste déroulante avec auto-complétion. Nécessite la prop `options`.                                         |
| `multiSelect`        | Liste déroulante pour des sélections multiples. Nécessite la prop `options`.                                |
| `textarea`           | Zone de texte multiligne.                                                                                  |
| `date`               | Sélecteur de date.                                                                                         |
| `dateRange`          | Sélecteur de plage de dates.                                                                               |
| `radio`              | Boutons radio pour une sélection unique parmi plusieurs options. Nécessite la prop `options`.             |
| `checkbox`           | Case à cocher unique (pour une valeur booléenne) ou groupe de cases (si `options` est fourni).            |
| `switch`             | Interrupteur à bascule (généralement pour une valeur booléenne).                                           |
| `file`               | Champ de téléversement de fichier standard.                                                                |
| `fileDropZone`       | Zone de glisser-déposer pour le téléversement de fichiers.                                                 |
| `number`             | Champ de saisie numérique.                                                                                 |
| `custom`             | Utilisé lorsque vous fournissez un `customInputFieldElement`.                                               |
| `tileSelector`       | Sélecteur de tuiles pour une sélection unique. Nécessite la prop `options`.                               |
| `tileMultiSelector`  | Sélecteur de tuiles pour des sélections multiples. Nécessite la prop `options`.                             |
| `phoneNumber`        | Champ de saisie de numéro de téléphone (peut inclure un formatage spécifique).                               |

### Interface `DividerReactFormMaker`

Utilisée pour insérer des séparateurs ou des éléments de structuration non interactifs dans le formulaire. Hérite de `CompositeField`.

| Propriété  | Type                                                                 | Requis    | Description                                                                                                                             |
| :--------- | :------------------------------------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `isDiv`    | `boolean`                                                            | Oui       | Doit être `true`. Indique que cet élément est un diviseur/conteneur structurel.                                                        |
| `className`| `string`                                                             | Optionnel | Classe CSS pour styliser le diviseur.                                                                                                   |
| `isHide`   | `boolean`                                                            | Optionnel | Si `true`, masque le diviseur.                                                                                                          |
| `fields`   | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]` | Optionnel | Permet d'imbriquer d'autres éléments à l'intérieur de ce diviseur, créant une structure de groupe.                                   |
| `children` | `JSX.Element`                                                        | Optionnel | Contenu JSX personnalisé à afficher à l'intérieur du diviseur.                                                                          |

### Interface `ReactFormMakerFieldset`

Permet de grouper logiquement des champs sous un titre commun (`legend`). Hérite de `CompositeField`.

| Propriété        | Type                                                                 | Requis    | Description                                                                                             |
| :--------------- | :------------------------------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------ |
| `fieldset`       | `string`                                                             | Oui       | Nom unique pour le fieldset (principalement pour l'organisation interne, pas pour les données du formulaire). |
| `legend`         | `string`                                                             | Optionnel | Titre affiché pour le groupe de champs.                                                                 |
| `legendClassName`| `string`                                                             | Optionnel | Classe CSS pour styliser la légende.                                                                    |
| `className`      | `string`                                                             | Optionnel | Classe CSS pour styliser l'élément fieldset.                                                            |
| `fields`         | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]` | Optionnel | Tableau des champs, diviseurs ou autres fieldsets imbriqués dans ce groupe.                             |
| `isHide`         | `boolean`                                                            | Optionnel | Si `true`, masque l'ensemble du fieldset.                                                               |

### Interface `ReactFormMakerStep`

Définit une étape dans un formulaire de type "stepper". Cette interface hérite de `CompositeField` et partage de nombreuses propriétés avec `ReactFormMakerFieldset`, mais ajoute des fonctionnalités spécifiques au stepper. Elle est utilisée lorsque la prop `stepper` de `ReactFormMaker` est à `true`.

| Propriété               | Type                                                                                 | Requis    | Description                                                                                                                                                                                             |
| :---------------------- | :----------------------------------------------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `stepName`              | `string`                                                                             | Oui       | Nom unique de l'étape, utilisé pour l'identification et la navigation.                                                                                                                                  |
| `isStep`                | `boolean`                                                                            | Optionnel | Doit être `true` pour indiquer que cet élément est une étape du stepper.                                                                                                                                |
| `legend`                | `string`                                                                             | Optionnel | Titre de l'étape, affiché en haut de l'étape.                                                                                                                                                           |
| `legendClassName`       | `string`                                                                             | Optionnel | Classe CSS pour styliser la légende de l'étape.                                                                                                                                                         |
| `className`             | `string`                                                                             | Optionnel | Classe CSS pour styliser le conteneur de l'étape.                                                                                                                                                       |
| `fields`                | `(FieldReactFormMaker \| DividerReactFormMaker \| ReactFormMakerFieldset)[]`           | Optionnel | Tableau des champs, diviseurs ou fieldsets contenus dans cette étape.                                                                                                                                     |
| `isHide`                | `boolean`                                                                            | Optionnel | Si `true`, masque l'étape.                                                                                                                                                                              |
| `children`              | `React.ReactNode`                                                                    | Optionnel | Enfants React personnalisés à afficher dans le contenu de l'étape.                                                                                                                                      |
| `disabledBefore`        | `boolean`                                                                            | Optionnel | Si `true` (par défaut `false`), désactive le bouton "Précédent" et la navigation vers les étapes précédentes via l'en-tête du stepper.                                                                 |
| `isStrict`              | `boolean`                                                                            | Optionnel | Si `true` (par défaut `false`), l'utilisateur ne peut pas passer à l'étape suivante tant que tous les champs de l'étape actuelle ne sont pas valides selon leur `zodObject`.                               |
| `onBeforeNextStep`      | `(data: { submissionState: StepFormState<any>; form: UseFormReturn<any>; }) => Promise<boolean>` | Optionnel | Fonction asynchrone exécutée avant de passer à l'étape suivante (après validation). Doit retourner `true` pour autoriser le passage, `false` pour l'empêcher. Permet des logiques de validation avancées. |
| `IconStep`              | `React.ComponentType<any>`                                                           | Optionnel | Composant React personnalisé pour l'icône de l'étape dans l'indicateur de progression du stepper.                                                                                                       |
| `buttonNextContent`     | `string`                                                                             | Optionnel | Texte personnalisé pour le bouton "Suivant" de cette étape.                                                                                                                                             |
| `buttonPreviousContent` | `string`                                                                             | Optionnel | Texte personnalisé pour le bouton "Précédent" de cette étape.                                                                                                                                           |
| `additionalButtons`     | `React.ReactNode`                                                                    | Optionnel | Éléments JSX supplémentaires (par exemple, des boutons) à afficher dans le pied de page de l'étape, après les boutons de navigation standard.                                                              |
| `footerClassName`       | `string \| string[]`                                                                   | Optionnel | Classe(s) CSS pour styliser le pied de page de l'étape.                                                                                                                                                 |

### Exemples de Configuration de Champs

```typescript
import { z } from 'zod'; // Assurez-vous d'importer Zod pour les exemples de validation

export const formFieldsExamples = [
  // 1. Champ texte simple
  {
    inputName: 'username',
    label: 'Nom d\'utilisateur',
    inputType: 'text',
    placeholder: 'Entrez votre nom d\'utilisateur',
    zodObject: z.string().min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères.'),
    description: 'Votre nom d\'utilisateur public.'
  },

  // 2. Champ select avec des options
  {
    inputName: 'country',
    label: 'Pays',
    inputType: 'select',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'ca', label: 'Canada' },
      { value: 'us', label: 'États-Unis' }
    ],
    zodObject: z.string().nonempty('Veuillez sélectionner un pays.'),
    defaultValues: 'fr'
  },

  // 3. Champ checkbox
  {
    inputName: 'subscribe',
    label: 'S\'abonner à la newsletter',
    inputType: 'checkbox',
    zodObject: z.boolean(),
    defaultValues: true
  },

  // 4. Groupe de cases à cocher (options pour un même inputName)
  {
    inputName: 'interests',
    label: 'Vos centres d\'intérêt',
    inputType: 'checkbox',
    options: [
      { value: 'tech', label: 'Technologie' },
      { value: 'sport', label: 'Sport' },
      { value: 'music', label: 'Musique' }
    ],
    zodObject: z.array(z.string()).min(1, 'Veuillez sélectionner au moins un intérêt.'),
    description: 'Cochez tout ce qui s\'applique.'
  },

  // 5. Utilisation de ReactFormMakerFieldset pour grouper des champs
  {
    fieldset: 'userProfile', // Nom du fieldset
    legend: 'Profil Utilisateur',
    className: 'user-profile-fieldset',
    fields: [
      {
        inputName: 'firstName',
        label: 'Prénom',
        inputType: 'text',
        zodObject: z.string().min(1, 'Le prénom est requis.')
      },
      {
        inputName: 'lastName',
        label: 'Nom de famille',
        inputType: 'text',
        zodObject: z.string().min(1, 'Le nom de famille est requis.')
      }
    ]
  },

  // 6. Utilisation de ReactFormMakerStep (pour un formulaire avec stepper={true})
  // Ceci serait un élément du tableau `formfields` principal
  {
    stepName: 'personalInfo',
    isStep: true,
    legend: 'Informations Personnelles',
    fields: [
      {
        inputName: 'fullName',
        label: 'Nom complet',
        inputType: 'text',
        zodObject: z.string().min(2, 'Le nom complet est requis.')
      },
      {
        inputName: 'birthDate',
        label: 'Date de naissance',
        inputType: 'date',
        zodObject: z.date().refine(date => date < new Date(), 'La date doit être dans le passé.')
      }
    ],
    // Propriétés spécifiques au step
    isStrict: true,
    buttonNextContent: 'Suivant : Adresse'
  }
];
```

## Définition Programmatique des Champs avec `FieldFactory`

Dans de nombreux générateurs de formulaires, la configuration initiale se fait souvent sous forme de JSON (ou d'objets littéraux JavaScript). Si cette approche est universelle et flexible, elle atteint vite ses limites :

- Les formulaires complexes deviennent difficiles à lire et à maintenir.
- La logique métier (validation, comportements dynamiques) se retrouve dispersée ou dupliquée.
- L’absence de typage fort et d’outils d’autocomplétion nuit à la robustesse du code.

**`FieldFactory`** répond à ces problématiques en proposant une approche orientée objet pour la définition des champs de formulaire. Elle sert de classe de base à des classes spécialisées (par exemple, `TextField`, `SelectField`, `PasswordField`, etc.), offrant plusieurs avantages :

-   **Configuration Fluide et Lisible** : Grâce au chaînage de méthodes (method chaining), la configuration des champs devient plus déclarative et expressive.
    ```typescript
    const emailField = new TextField('email')
      .setLabel('Adresse email')
      .isEmail() // Méthode spécifique à TextField pour appliquer une validation d'email
      .setPlaceholder('Entrez votre email')
      .setRequired('L'adresse email est obligatoire.');
    ```
-   **Centralisation de la Logique Métier et Validation** : Chaque classe spécialisée (par exemple, `TextField`) peut embarquer ses propres règles de validation Zod et logiques de comportement. Par exemple, la méthode `.isEmail()` sur une instance de `TextField` pourrait automatiquement configurer le `zodObject` approprié pour la validation d'emails. Cela évite la duplication et garantit la cohérence.
-   **Extensibilité Facilitée** : Ajouter un nouveau type de champ ou une nouvelle règle de validation devient plus simple. Il suffit de créer une nouvelle classe héritant de `FieldFactory` (ou d'une autre classe de champ) ou d'ajouter une nouvelle méthode à une classe existante.
-   **Meilleure Expérience Développeur** : L'utilisation de classes et de TypeScript offre un typage fort, une autocomplétion avancée dans les IDEs, et une documentation intégrée via les TSDoc, réduisant les erreurs et augmentant la productivité.
-   **Configuration Évolutive** : Pour des besoins simples, la configuration par objets littéraux reste possible. Mais pour des formulaires complexes, l'approche orientée objet avec `FieldFactory` permet une structuration plus poussée sans sacrifier la lisibilité ni la maintenabilité.

### Usage et Utilité

`FieldFactory` et ses classes dérivées permettent de :

1.  **Définir des champs de formulaire de façon déclarative et expressive.**
2.  **Centraliser la logique métier et la validation** au sein des classes de champ.
3.  **Faciliter la maintenance et l’évolution** de la configuration des formulaires.
4.  **Bénéficier d’un typage fort et d’une autocomplétion avancée.**

### Exemple d'Utilisation avec `TextField`

La classe `TextField` (située dans `frontend/src/components/ReactFormMaker/FormFields/Class/TextFields.class.ts`) est un exemple de classe dérivée de `FieldFactory`. Voici comment l'utiliser pour définir des champs de texte et les intégrer dans `ReactFormMaker` :

```typescript
// Assurez-vous que le chemin d'importation est correct
import { TextField } from './frontend/src/components/ReactFormMaker/FormFields/Class/TextFields.class';
import ReactFormMaker from './frontend/src/components/ReactFormMaker/ReactFormMaker'; // Ajustez le chemin
import { FieldValues } from 'react-hook-form';
import { z } from 'zod'; // Importation de Zod pour d'autres champs si nécessaire

// Définition des champs en utilisant la classe TextField
const usernameField = new TextField('username') // 'username' est le inputName
  .setLabel('Nom d\'utilisateur')
  .setPlaceholder('Votre nom d\'utilisateur unique')
  .setRequired('Le nom d\'utilisateur est requis.') // Applique une validation Zod simple
  .setMinLength(5, 'Doit contenir au moins 5 caractères.');

const emailField = new TextField('userEmail')
  .setLabel('Adresse Email')
  .isEmail() // Applique la validation Zod pour email et met un placeholder par défaut
  .setRequired('L\'email est obligatoire.');

const websiteField = new TextField('userWebsite')
  .setLabel('Site Web (optionnel)')
  .isUrl() // Applique la validation Zod pour URL et un comportement onSelect
  .setZodObject(z.string().url().optional()); // Permet de surcharger ou affiner le ZodObject

// Les objets de champ configurés peuvent être directement utilisés dans formfields.
// La méthode .getConfig() de la classe FieldFactory retourne l'objet FieldReactFormMaker.
const myFormFields = [
  usernameField.getConfig(),
  emailField.getConfig(),
  websiteField.getConfig(),
  // Vous pouvez toujours mélanger avec des objets de configuration littéraux
  {
    inputName: 'age',
    inputType: 'number',
    label: 'Âge',
    zodObject: z.number().min(18)
  }
];

const MyComponentUsingFieldFactory = () => {
  const handleSubmit = (data: FieldValues) => {
    console.log('Données du formulaire:', data);
  };

  return (
    <ReactFormMaker
      formfields={myFormFields}
      onSubmit={handleSubmit}
      btnTextSubmit="Soumettre"
    />
  );
};

export default MyComponentUsingFieldFactory;
```

Cette approche favorise une meilleure organisation et réutilisabilité de la configuration de vos champs de formulaire, surtout pour les applications de grande taille.

## Personnalisation du Style

La majorité des champs du formulaire et le composant `ReactFormMaker` lui-même s'appuient sur la bibliothèque de composants **ShadCN/UI**, qui est basée sur **Tailwind CSS**. L'objectif est de centraliser la gestion des styles pour garantir cohérence et maintenabilité, tout en offrant plusieurs niveaux de personnalisation pour s'adapter à des besoins spécifiques.

### Bonnes pratiques pour la personnalisation du style

Voici les approches recommandées pour personnaliser l'apparence de vos formulaires :

1.  **Centralisation via la configuration Tailwind (`tailwind.config.ts`)**
    *   **Description** : C'est la méthode à privilégier pour des modifications globales et cohérentes. En ajustant votre fichier `tailwind.config.ts` (ou `tailwind.config.js`, `postcss.config.mjs` selon votre configuration), vous pouvez redéfinir les couleurs primaires, les polices, les espacements, etc., qui seront appliqués à l'ensemble de votre UI, y compris les composants ShadCN utilisés par `ReactFormMaker`.
    *   **Avantage** : Maintient une cohérence stylistique à travers toute votre application.

2.  **Surcharge des composants ShadCN/UI (dans le dossier `ui`)**
    *   **Description** : Lorsque vous initialisez ShadCN/UI dans votre projet (via la commande `npx shadcn-ui@latest init`), les composants que vous choisissez d'utiliser (comme `Button`, `Input`, `Select`, etc.) sont ajoutés à votre code base, typiquement dans un dossier `components/ui`. `ReactFormMaker` utilise ces composants. Vous pouvez directement modifier le code de ces composants pour des ajustements plus spécifiques qui ne sont pas possibles via la configuration Tailwind seule.
    *   **Avantage** : Contrôle fin sur l'apparence et le comportement des composants de base.
    *   **Note** : Soyez conscient que si vous mettez à jour les composants ShadCN via leur CLI (`add` pour un composant existant), vos modifications locales pourraient être écrasées. Gérez ces composants comme faisant partie de votre code source.

3.  **Ajustement des styles des composants spécifiques au projet (`ReactFormMaker/enhancements` et autres)**
    *   **Description** : `ReactFormMaker` peut contenir des composants internes ou des "enhancements" (améliorations) qui ne sont pas directement des composants ShadCN/UI bruts. Si ces composants ont leurs propres fichiers de style ou permettent des props de style, vous pouvez les ajuster là. Le chemin exact peut varier, mais explorez la structure du dossier `ReactFormMaker` pour de tels composants.
    *   **Avantage** : Permet de cibler des éléments spécifiques à la logique de `ReactFormMaker`.

4.  **Personnalisation ponctuelle via la prop `className`**
    *   **Description** :
        *   **Sur le composant `ReactFormMaker`** : La prop `className` permet d'appliquer des classes Tailwind (ou CSS globales) au conteneur principal du formulaire. La prop `footerClassName` cible spécifiquement le pied de page du formulaire.
        *   **Sur les définitions de champs (`formfields`)** : Chaque objet champ dans le tableau `formfields` (qu'il s'agisse d'un `FieldReactFormMaker`, `ReactFormMakerFieldset`, etc.) peut accepter une prop `className` (ou `classname` pour `CompositeField` et ses dérivés comme `ReactFormMakerFieldset`, `legendClassName` pour les légendes de fieldset). Ces classes sont appliquées à l'élément wrapper du champ ou à l'élément spécifique.
    *   **Utilisation de `cn`** : Il est recommandé d'utiliser une fonction utilitaire comme `cn` (souvent fournie par ShadCN/UI, basée sur `clsx` et `tailwind-merge`) pour construire vos chaînes de `className`. `cn` permet de fusionner intelligemment les classes Tailwind, de gérer les classes conditionnelles et d'éviter les conflits de classes.
        ```typescript
        // Exemple dans la configuration d'un champ
        {
          inputName: 'email',
          inputType: 'text',
          label: 'Email',
          className: cn('border-blue-500', { 'bg-gray-100': isDisabled })
        }
        ```
    *   **Avantage** : Idéal pour des ajustements spécifiques à un champ ou à un formulaire sans affecter les autres. Très flexible pour des changements dynamiques basés sur l'état.

En combinant ces approches, vous pouvez obtenir un contrôle précis sur l'apparence de vos formulaires générés par `ReactFormMaker`, tout en maintenant une base de style cohérente et facile à gérer.

## Aspects Avancés

Cette section couvre des fonctionnalités plus avancées de `ReactFormMaker`, destinées aux utilisateurs souhaitant étendre ou personnaliser en profondeur le comportement de leurs formulaires.

### Hooks Personnalisés

`ReactFormMaker` utilise en interne plusieurs hooks React pour gérer sa logique. Bien que leur utilisation directe ne soit généralement pas nécessaire pour la plupart des cas d'usage, les connaître peut être utile pour des scénarios d'extension ou de débogage avancé.

-   **`useReactFormMaker<T extends FieldValues>(formfieldsAttributes: CompositeField[])`**
    *   **Rôle** : Ce hook est au cœur de la génération du formulaire. Il prend la configuration `formfields`, initialise `react-hook-form` (y compris la génération du schéma Zod à partir des `zodObject` des champs et la gestion des valeurs par défaut), et retourne l'instance du formulaire (`form`), le schéma Zod généré (`formSchema`), les valeurs par défaut (`dataFieldsDefaultValues`), l'objet Zod brut (`zObject`), et une fonction utilitaire `hasSubmitButton` pour détecter si un bouton de soumission est déjà présent parmi les enfants.
    *   **Utilité principale** : Gère toute la logique d'initialisation de `react-hook-form` et la transformation de la configuration `formfields` en un schéma Zod utilisable. Principalement utilisé en interne par le composant `ReactFormMaker`.

-   **`useFormHandlers<T extends FieldValues>({ onSubmit: (data, errors) => void })`**
    *   **Rôle** : Ce hook simplifie la gestion des callbacks de soumission de `react-hook-form`. Il prend une unique fonction `onSubmit` (celle que vous passez à `ReactFormMaker`) et la divise en deux gestionnaires : `onValid` (pour les soumissions réussies) et `onInvalid` (pour les soumissions échouées à cause d'erreurs de validation).
    *   **Utilité principale** : Fournit les fonctions `onValid` et `onInvalid` que `react-hook-form` attend pour sa propre fonction `handleSubmit`. Utilisé en interne pour brancher votre callback `onSubmit` au système de soumission de `react-hook-form`.

-   **`useFormFieldsMap<T extends FieldValues>(form: UseFormReturn<T>)`**
    *   **Rôle** : Ce hook est responsable du rendu récursif des champs de formulaire et des fieldsets. Il retourne des fonctions (`FormFieldsMap`, `FieldsetMap`) qui itèrent sur la configuration `formfields` et affichent les composants de champ appropriés (comme `FormFieldElement`, `DivElementField`) ou les fieldsets. Il retourne également `InpuTComponentCallBack`, une fonction mémoïsée pour rendre le `InputComponent` utilisé pour chaque champ.
    *   **Utilité principale** : Gère la logique de mapping de la configuration des champs vers les éléments JSX rendus. C'est le moteur de rendu dynamique des champs. Principalement pour usage interne.

Ces hooks encapsulent la complexité de l'intégration avec `react-hook-form` et la logique de rendu dynamique. Pour étendre `ReactFormMaker`, il est généralement préférable de créer des types de champs personnalisés ou d'utiliser les props de configuration existantes plutôt que d'interagir directement avec ces hooks, sauf si vous construisez une fonctionnalité de formulaire très spécifique.

### Gestion des Événements sur les Champs

Vous pouvez attacher des gestionnaires d'événements directement à vos champs lors de leur configuration dans le tableau `formfields`. Les événements courants comme `onChange`, `onBlur`, et `onClick` sont supportés.

Ces fonctions de rappel reçoivent un objet `FormFieldEvent` qui contient deux propriétés :
-   `event`: L'événement brut du navigateur (par exemple, `React.ChangeEvent<HTMLInputElement>`, `React.FocusEvent<HTMLInputElement>`).
-   `form`: L'instance complète de `react-hook-form` (`UseFormReturn<T>`). Cela vous donne un accès direct à toutes les méthodes de `react-hook-form` (comme `setValue`, `getValue`, `trigger`, `formState`, etc.) à l'intérieur de votre gestionnaire d'événements.

Pour la signature exacte et plus de détails sur `FormFieldEvent`, référez-vous à la documentation de l'interface `FieldReactFormMaker` (section "Events").

#### Exemple d'utilisation de `onChange`

```typescript
import { FormFieldEvent } from './frontend/src/components/ReactFormMaker/interfaces/FormFieldEvent'; // Ajustez le chemin
import { FieldValues } from 'react-hook-form';
import { z } from 'zod';

// Supposons que TFormData est votre type de données de formulaire
interface TFormData extends FieldValues {
  firstName: string;
  lastName?: string;
  hasNickname?: boolean;
  nickname?: string;
}

const handleFirstNameChange = (fieldEvent: FormFieldEvent<TFormData>) => {
  const { event, form } = fieldEvent;
  const newValue = (event.target as HTMLInputElement).value;

  console.log(`Le prénom est maintenant : ${newValue}`);

  // Exemple d'interaction avec react-hook-form :
  // Mettre à jour dynamiquement un autre champ
  form.setValue('lastName', newValue + ' Smith');

  // Déclencher la validation pour un autre champ
  if (newValue.length > 2) {
    form.trigger('lastName');
  }
};

const handleNicknameVisibility = (fieldEvent: FormFieldEvent<TFormData>) => {
  const { event, form } = fieldEvent;
  const isChecked = (event.target as HTMLInputElement).checked;
  // Vous pourriez utiliser form.setValue pour afficher/masquer ou activer/désactiver le champ nickname
  // ou simplement gérer l'état localement si le champ nickname est conditionnellement rendu
  console.log(`Afficher le surnom : ${isChecked}`);
  if (!isChecked) {
    form.setValue('nickname', ''); // Effacer le surnom si la case est décochée
    form.unregister('nickname'); // Optionnel: dé-enregistrer le champ pour qu'il ne soit pas soumis
  } else {
    form.register('nickname'); // Enregistrer le champ s'il était dé-enregistré
  }
};

export const formFieldsWithEvents: Array<FieldReactFormMaker> = [
  {
    inputName: 'firstName',
    inputType: 'text',
    label: 'Prénom',
    zodObject: z.string().min(1),
    onChange: handleFirstNameChange,
  },
  {
    inputName: 'hasNickname',
    inputType: 'checkbox',
    label: 'Avez-vous un surnom ?',
    onChange: handleNicknameVisibility,
    zodObject: z.boolean().optional(),
  },
  {
    inputName: 'nickname',
    inputType: 'text',
    label: 'Surnom (si applicable)',
    // Ce champ pourrait être masqué/affiché conditionnellement en fonction de 'hasNickname'
    // en utilisant la propriété 'isHide' et en la mettant à jour via form.setValue dans handleNicknameVisibility,
    // ou en gérant cela dans le rendu JSX de votre composant.
    // Pour cet exemple, nous supposons qu'il est toujours visible mais sa valeur est gérée.
    zodObject: z.string().optional(),
  }
  // ... autres champs
];

// Utilisez ensuite formFieldsWithEvents dans <ReactFormMaker formfields={formFieldsWithEvents} ... />
```

Dans cet exemple, `handleFirstNameChange` est appelée chaque fois que la valeur du champ "firstName" change. Elle a accès à l'événement du navigateur et à l'instance complète du formulaire `react-hook-form`, permettant des logiques complexes et des interactions entre champs. De même, `handleNicknameVisibility` réagit aux changements de la case à cocher pour potentiellement manipuler la visibilité ou l'état du champ "nickname".
L'utilisation de `form.setValue`, `form.trigger`, `form.register`, `form.unregister` etc., à l'intérieur de ces gestionnaires d'événements permet une grande flexibilité pour créer des formulaires dynamiques et interactifs.

## Exemples Complets

Cette section fournit des exemples plus complets illustrant comment combiner les différentes configurations de champs et les props du composant `ReactFormMaker` pour construire des formulaires courants.

### Exemple 1: Formulaire d'Inscription Complet

Cet exemple montre un formulaire d'inscription typique avec validation.

**Configuration des champs (`formfields`) :**

```typescript
import { z } from 'zod';
import { FieldReactFormMaker, ReactFormMakerFieldset } from './interfaces/FieldInterfaces'; // Ajustez le chemin

// Schéma Zod global pour la validation croisée des mots de passe
const registrationSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit faire au moins 3 caractères."),
  email: z.string().email("Adresse email invalide."),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères."),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"], // Erreur associée au champ confirmPassword
});


// Définition des champs pour ReactFormMaker
// Note: La validation croisée des mots de passe est gérée par le schéma global `registrationSchema`
// qui sera passé au resolver de react-hook-form.
// Les `zodObject` individuels ici sont pour la validation par champ.

export const registrationFormFields: (FieldReactFormMaker | ReactFormMakerFieldset)[] = [
  {
    fieldset: 'accountInfo',
    legend: 'Informations du Compte',
    className: 'mb-6',
    fields: [
      {
        inputName: 'username',
        label: 'Nom d\'utilisateur',
        inputType: 'text',
        placeholder: 'ex: supercoder',
        zodObject: registrationSchema.shape.username, // Référence au schéma Zod
        description: 'Sera affiché sur votre profil public.'
      },
      {
        inputName: 'email',
        label: 'Adresse Email',
        inputType: 'text', // inputType 'email' pourrait aussi être utilisé si un composant spécifique est mappé
        placeholder: 'vous@exemple.com',
        zodObject: registrationSchema.shape.email,
      },
    ],
  },
  {
    fieldset: 'security',
    legend: 'Sécurité',
    fields: [
      {
        inputName: 'password',
        label: 'Mot de passe',
        inputType: 'password',
        placeholder: '********',
        zodObject: registrationSchema.shape.password,
      },
      {
        inputName: 'confirmPassword',
        label: 'Confirmer le mot de passe',
        inputType: 'password',
        placeholder: '********',
        // Le zodObject ici est simple, la vérification de correspondance est dans le schéma global.
        zodObject: z.string().min(1, "Veuillez confirmer le mot de passe."),
      },
    ],
  },
  {
    inputName: 'acceptTerms',
    label: 'J\'accepte les conditions d\'utilisation et la politique de confidentialité.',
    inputType: 'checkbox',
    zodObject: registrationSchema.shape.acceptTerms,
    className: 'mt-4 items-start' // Ajustement pour aligner le label avec la checkbox
  }
];
```

**Utilisation dans un composant React :**

```tsx
import React from 'react';
import ReactFormMaker from './ReactFormMaker'; // Ajustez le chemin d'importation
import { registrationFormFields } from './path-to/registrationFormFields'; // Ajustez le chemin
import { FieldValues } from 'react-hook-form';
// import { z } from 'zod'; // Zod est déjà utilisé dans registrationFormFields.ts

// Définissez le type de données attendu par votre formulaire, si vous utilisez TypeScript
interface RegistrationFormData extends FieldValues {
  username: string;
  email: string;
  password?: string; // Le mot de passe peut être optionnel après soumission pour ne pas le renvoyer
  confirmPassword?: string;
  acceptTerms: boolean;
}

const RegistrationForm = () => {
  const handleSubmit = (data: RegistrationFormData | false, errors: FieldValues | false) => {
    if (data) {
      console.log('Formulaire d\'inscription soumis avec succès:', data);
      // Envoyer les données au backend, sans les mots de passe si possible
      const { password, confirmPassword, ...submissionData } = data;
      console.log('Données à envoyer:', submissionData);
    } else {
      console.error('Erreurs de validation:', errors);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>
      <ReactFormMaker<RegistrationFormData>
        formfields={registrationFormFields}
        onSubmit={handleSubmit}
        btnTextSubmit="S'inscrire"
        // Vous pourriez passer le schéma Zod global ici si ReactFormMaker le permettait
        // directement, ou vous assurer que useReactFormMaker.hook.ts le construit
        // correctement en interne, y compris le .refine pour la validation croisée.
        // Pour l'instant, on suppose que le hook interne gère la création du schéma
        // à partir des zodObjects des champs et applique le .refine() si nécessaire.
        // La validation croisée des mots de passe est gérée par le schéma Zod
        // lors de l'initialisation de react-hook-form dans `useReactFormMaker.hook.ts`.
        // Le hook doit être capable de détecter la présence des champs `password` et `confirmPassword`
        // et d'ajouter la validation `.refine` au schéma global.
      />
    </div>
  );
};

export default RegistrationForm;
```

**Explication :**
-   Le fichier `registrationFormFields.ts` (nommé hypothétiquement) définit la structure du formulaire.
-   Nous utilisons `ReactFormMakerFieldset` pour grouper les champs "Informations du Compte" et "Sécurité".
-   Chaque champ a son propre `zodObject` pour la validation individuelle.
-   **Important pour la confirmation du mot de passe** : La validation directe que `password` et `confirmPassword` correspondent est généralement effectuée au niveau du schéma Zod global utilisé par `react-hook-form`. Le hook `useReactFormMaker` devrait être conçu pour construire ce schéma global en combinant les `zodObject` individuels et en y ajoutant des raffinements (`.refine()`) pour les validations croisées. Dans l'exemple de `registrationFormFields`, nous avons défini un `registrationSchema` complet, et les `zodObject` des champs font référence aux shapes de ce schéma. Le hook `useReactFormMaker` est supposé utiliser ce schéma Zod complet (avec le `.refine`) lors de l'initialisation de `useForm` avec `zodResolver`.
-   Le composant `RegistrationForm` instancie `ReactFormMaker` avec cette configuration et une fonction `handleSubmit`.

### Exemple 2: Formulaire à Étapes (Stepper) Détaillé

Cet exemple étend le concept de formulaire à étapes, montrant une structure plus complexe avec des validations par étape.

**Configuration des champs (`formfields`) pour le stepper :**

```typescript
import { z } from 'zod';
import { ReactFormMakerStep, FieldReactFormMaker } from './interfaces/FieldInterfaces'; // Ajustez le chemin

export const detailedStepperFormFields: ReactFormMakerStep[] = [
  {
    stepName: 'personalInfo',
    isStep: true,
    legend: 'Étape 1: Vos Informations Personnelles',
    fields: [
      {
        inputName: 'firstName',
        label: 'Prénom',
        inputType: 'text',
        zodObject: z.string().min(2, 'Le prénom est requis (minimum 2 caractères).'),
        placeholder: 'Jean',
      },
      {
        inputName: 'lastName',
        label: 'Nom de famille',
        inputType: 'text',
        zodObject: z.string().min(2, 'Le nom est requis (minimum 2 caractères).'),
        placeholder: 'Dupont',
      },
    ],
    isStrict: true, // L'utilisateur doit valider cette étape pour continuer
  },
  {
    stepName: 'contactInfo',
    isStep: true,
    legend: 'Étape 2: Comment vous Contacter',
    fields: [
      {
        inputName: 'email',
        label: 'Adresse Email',
        inputType: 'text', // ou 'email'
        zodObject: z.string().email('Adresse email invalide.'),
        placeholder: 'jean.dupont@email.com',
      },
      {
        inputName: 'phoneNumber',
        label: 'Numéro de téléphone (optionnel)',
        inputType: 'phoneNumber', // Type spécifique pour potentiellement un composant customisé
        zodObject: z.string().optional().refine(val => !val || /^[0-9+\s()-]*$/.test(val), {
            message: "Numéro de téléphone invalide.",
        }),
        placeholder: '06 12 34 56 78',
      },
    ],
    isStrict: true,
  },
  {
    stepName: 'preferences',
    isStep: true,
    legend: 'Étape 3: Vos Préférences',
    fields: [
      {
        inputName: 'newsletter',
        label: 'Souhaitez-vous vous abonner à notre newsletter ?',
        inputType: 'radio',
        options: [
          { value: 'yes', label: 'Oui, avec plaisir !' },
          { value: 'no', label: 'Non merci.' },
        ],
        zodObject: z.enum(['yes', 'no'], { required_error: "Veuillez faire un choix." }),
        defaultValues: 'no',
      },
      {
        inputName: 'preferredContact',
        label: 'Comment préférez-vous être contacté(e) ?',
        inputType: 'select',
        options: [
          { value: '', label: 'Sélectionnez une option...' },
          { value: 'email', label: 'Par Email' },
          { value: 'phone', label: 'Par Téléphone (si fourni)' },
        ],
        zodObject: z.string().nonempty("Veuillez sélectionner une méthode de contact."),
        isHide: (form) => { // Exemple de champ conditionnel basé sur les valeurs du formulaire
          return !form?.watch('email') && !form?.watch('phoneNumber');
        }
      },
    ],
  },
  {
    stepName: 'summary',
    isStep: true,
    legend: 'Étape 4: Résumé et Soumission',
    // Ce champ pourrait utiliser un composant personnalisé pour afficher un résumé
    // ou simplement un champ de type 'custom' avec du contenu informatif.
    // Pour la simplicité, nous ajoutons une simple checkbox de confirmation.
    fields: [
        {
            inputName: 'finalConfirmation',
            label: 'Je confirme que toutes les informations sont correctes et je souhaite soumettre ma demande.',
            inputType: 'checkbox',
            zodObject: z.boolean().refine(val => val === true, {
                message: "Veuillez confirmer pour soumettre."
            })
        }
    ],
    // onBeforeNextStep: async (data) => { console.log("Dernière vérification avant soumission", data); return true; }
  }
];
```

**Utilisation dans un composant React :**

```tsx
import React from 'react';
import ReactFormMaker from './ReactFormMaker'; // Ajustez le chemin
import { detailedStepperFormFields } from './path-to/detailedStepperFormFields'; // Ajustez le chemin
import { FieldValues } from 'react-hook-form';

interface DetailedStepperFormData extends FieldValues {
  // Définissez les types pour chaque champ si vous le souhaitez
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  newsletter: 'yes' | 'no';
  preferredContact: 'email' | 'phone' | '';
  finalConfirmation: boolean;
}

const DetailedStepperForm = () => {
  const handleSubmit = (data: DetailedStepperFormData | false, errors: FieldValues | false) => {
    if (data) {
      console.log('Formulaire à étapes soumis avec succès:', data);
      // Traitement des données finales
    } else {
      console.error('Erreurs de validation dans le stepper:', errors);
      // Peut-être naviguer vers la première étape avec une erreur si nécessaire
    }
  };

  return (
    <div className="w-full mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Formulaire Multi-Étapes</h2>
      <ReactFormMaker<DetailedStepperFormData>
        formfields={detailedStepperFormFields}
        onSubmit={handleSubmit}
        stepper={true}
        orientation="horizontal" // ou "vertical"
        btnTextSubmit="Soumettre la Demande" // Texte du bouton sur la dernière étape
        className="bg-white p-6 rounded-xl shadow-xl" // Style pour le conteneur du stepper
      />
    </div>
  );
};

export default DetailedStepperForm;
```

**Points Clés de la Configuration du Stepper :**
-   Chaque objet dans le tableau `detailedStepperFormFields` est une configuration d'étape (`ReactFormMakerStep`).
-   `stepName` : Un identifiant unique pour l'étape.
-   `isStep: true` : Indique que cet objet définit une étape.
-   `legend` : Le titre de l'étape.
-   `fields` : Un tableau de configurations de champs (`FieldReactFormMaker`) pour cette étape spécifique.
-   `isStrict: true` : (Optionnel) Si défini à `true` sur une étape, l'utilisateur ne pourra pas passer à l'étape suivante tant que tous les champs de l'étape actuelle ne sont pas valides selon leurs `zodObject`.
-   La prop `stepper={true}` sur `<ReactFormMaker>` active le mode stepper.
-   `orientation` peut être `"horizontal"` ou `"vertical"`.
-   Le `btnTextSubmit` sera affiché sur le bouton de la dernière étape. Les étapes intermédiaires auront des boutons "Suivant" et "Précédent" (textes personnalisables via les props de `ReactFormMakerStep` comme `buttonNextContent`).
-   La propriété `isHide` sur un champ peut être une fonction qui reçoit l'instance du formulaire `react-hook-form`, permettant de masquer/afficher des champs dynamiquement en fonction d'autres valeurs du formulaire (par exemple, `form.watch('fieldName')`).

Ces exemples illustrent la flexibilité de `ReactFormMaker` pour créer à la fois des formulaires simples et des formulaires multi-étapes plus complexes, en s'appuyant sur une configuration déclarative.
