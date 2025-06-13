# FieldFactory Class

## Propriétés de la classe `FieldFactory`

| Attribut          | Type                                               | Requis    | Description                                                                                                                                                       |
| ----------------- | -------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputName`       | `string`                                           | Requis    | Le nom du champ d'entrée. C'est la clé de l'objet retourné lorsque le formulaire est soumis.                                                                      |
| `label`           | `string`                                           | Optionnel | Le label du champ d'entrée, affiché au-dessus du champ pour des raisons d'accessibilité.                                                                          |
| `placeholder`     | `string`                                           | Optionnel | Le texte du placeholder affiché à l'intérieur du champ lorsqu'il est vide. Pertinent pour les types d'entrée comme texte, mot de passe, textarea, date et nombre. |
| `inputType`       | `string`                                           | Requis    | Le type du champ d'entrée à afficher.                                                                                                                             |
| `zodObject`       | `ZodType<any>`                                     | Optionnel | L'objet Zod utilisé pour valider le champ d'entrée. Recommandé pour une validation type-safe. [Plus d'infos](https://zod.dev/?id=primitives).                     |
| `defaultValues`   | `any`                                              | Optionnel | Les valeurs par défaut affichées dans le champ d'entrée.                                                                                                          |
| `options`         | `string[]` ou `{ value: string; label: string }[]` | Optionnel | Options pour les types d'entrée `select`, `radio` ou `checkbox`. Requis si le type d'entrée est l'un de ceux-ci.                                                  |
| `className`       | `string`                                           | Optionnel | La classe CSS pour styliser le champ d'entrée en utilisant Tailwind CSS. [Plus d'infos](https://tailwindcss.com/).                                                |
| `disabled`        | `boolean`                                          | Optionnel | Désactive le champ d'entrée lorsqu'il est vrai.                                                                                                                   |
| `fields`          | `(extended CompositeField)[]`                      | Optionnel | Composants enfants affichés dans le champ d'entrée.                                                                                                               |
| `isDiv`           | `boolean`                                          | Optionnel | Si vrai, rend le fieldset comme un `<div>` au lieu d'un `<fieldset>` sémantique.                                                                                  |
| `legend`          | `string`                                           | Optionnel | La légende du champ d'entrée affichée comme le titre du fieldset.                                                                                                 |
| `legendClassName` | `string`                                           | Optionnel | La classe CSS pour styliser la légende en utilisant Tailwind CSS.                                                                                                 |
| `description`     | `string`                                           | Optionnel | Le texte de description affiché avec le champ d'entrée.                                                                                                           |
| `isSecure`        | `boolean`                                          | Optionnel | Cache le champ d'entrée pour des raisons de sécurité lorsqu'il est vrai.                                                                                          |

## Constructeur

```typescript
constructor(name: string, entries?: Partial<T>) {
  this.inputName = createNoSpacesString(name);
  if (entries) Object.assign(this, entries);
}
```
