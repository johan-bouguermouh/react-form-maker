# React Form Maker

## Introduction

React Form Maker est un outil destiné à faciliter le travail d'édition de formulaire simple et répétitif. Il se base sur un approche de JSON simple avec les informations utile à l'insertion des champs lier au formulaire.
React Form Maker allie la force de React Hook Form & Zod pour assurer un state mangement robuste tout en integrant un validation de formulaire.
React Form Maker est basé sur ShadCn et la librairie Radix Ui permettant à chaque développeur la possibiliter de modifier à la racine le comportement et l'UI de leurs composant.

### Pourquoi ce projet ?

ReactFormMaker est né du constat que l'intégration de bibliothèques comme **Shadcn UI**, **Radix UI**, **React Hook Form** et **Zod** conduit souvent à un JSX très verbeux, surtout lorsqu'on souhaite bénéficier à la fois d'une UI cohérente, d'une gestion avancée du contexte et d'une validation robuste. Un simple champ de formulaire peut rapidement occuper 6 à 10 lignes de code, rendant le code difficile à maintenir et à factoriser.

### **Philosophie**

Ce projet vise à :

- **Normaliser l'UI** des formulaires grâce à des composants réutilisables et cohérents.
- **Centraliser la logique métier** et la configuration des champs dans des objets ou du JSON, plutôt que dans le JSX.
- **Réduire la quantité de code à écrire** pour chaque formulaire, tout en gardant la puissance de React Hook Form et Zod pour la gestion du contexte et la validation.
- **Faciliter la personnalisation** et la gestion de cas complexes (champs conditionnels, validations avancées, etc.) sans complexifier le code JSX.

### **Concepts clés**

**React Form Maker** adopte un pattern **configuration-driven UI **: l'intégralité du formulaire est décrite par une configuration métier, permettant de générer dynamiquement des composants intelligents et cohérents, tout en gardant la logique métier centralisée et factorisée.

**ReactFormMaker** propose une architecture où la configuration métier pilote la génération de formulaires, tout en s'appuyant sur une base UI solide et normalisée grâce à shadcn/ui.
Cette approche garantit des formulaires cohérents, personnalisables et faciles à maintenir, tout en limitant la verbosité du code JSX.

## Documentation Détaillée

Pour une documentation plus approfondie sur l'utilisation du composant `ReactFormMaker`, la configuration des champs, les props disponibles, la personnalisation du style, les aspects avancés et des exemples complets, veuillez consulter la [documentation détaillée](./src/components/ReactFormMaker/DOCUMENTATION.md).

## Organisation du projet

Le fonctionnement du projet s’articule autour de **quatre grandes étapes** :

1. **Définition de la configuration du formulaire**
   Le développeur crée un objet de configuration décrivant les champs du formulaire, leurs types, validations et options.
2. **Analyse et préparation par le hook React Hook Form**Cet objet de configuration est transmis à un hook personnalisé basé sur React Hook Form.Ce hook :

   - Analyse la configuration,
   - Génère dynamiquement le schéma de validation Zod adapté,
   - Prépare tous les attributs nécessaires au bon fonctionnement du formulaire (valeurs par défaut, validation, etc.).

3. **Génération dynamique des composants JSX**
   Les champs sont ensuite générés automatiquement, selon l’ordre et la profondeur définis dans la configuration.
   Un composant générique se charge de wrapper chaque champ avec la structure et les attributs attendus, pour garantir la cohérence et la flexibilité de l’UI.
4. **Rendu du formulaire et exposition du contexte**
   Le formulaire final est rendu avec tous les champs correctement reliés à React Hook Form.
   Le contexte du formulaire est exposé, permettant aux développeurs de manipuler ou d’écouter les données du formulaire en dehors du JSX si besoin.

### ❓ Les formulaires générés dynamiquement rendent-ils le rendu React plus lourd ou moins performant ?

Notre bibliothèque repose sur une architecture modulaire et optimisée, inspirée des meilleures pratiques React et React Hook Form, pour garantir :

- **Un rendu performant**, même avec des formulaires complexes ou de grande taille,
- **Une indépendance totale des champs** : la modification d’un champ ne déclenche pas le re-render des autres.

#### **1. Génération dynamique, mais structure statique pour React**

Même si le formulaire est généré à partir d’une configuration (objet ou tableau), le résultat final est un arbre JSX classique. React ne fait aucune différence entre un formulaire “écrit à la main” et un formulaire généré dynamiquement : il ne voit que le JSX final.

#### **2. Utilisation avancée du contexte React Hook Form**

Chaque champ est connecté au contexte de React Hook Form.Cela permet :

- De gérer l’état et la validation de chaque champ de façon isolée,
- De ne re-render que le champ concerné lorsqu’une valeur change,
- D’éviter les re-rendus globaux du formulaire.

#### **3. Optimisation des composants de champ**

- **Chaque composant de champ est encapsulé dans un `React.memo`** : il ne se re-render que si ses propres props changent.
- **Les callbacks (handlers, mapping, etc.) sont mémorisés avec `useCallback`** pour éviter de recréer des fonctions à chaque rendu.
- **Les valeurs calculées (ex : listes d’options)** sont mémorisées avec `useMemo` pour éviter les recalculs inutiles.

#### **4. Découplage et granularité**

- L’arbre de composants est découpé de façon à ce que chaque champ, ou groupe de champs, soit indépendant.
- Les wrappers et fieldsets sont eux aussi optimisés pour ne pas propager de re-rendus inutiles.

#### **5. Résultat : pas d’interdépendance de rendu**

Grâce à cette architecture :

- **Modifier un champ ne provoque pas le re-render des autres champs**,
- **Le formulaire reste fluide et performant**, même avec beaucoup de champs ou des validations complexes,
- **La génération dynamique n’a aucun impact négatif sur la performance** par rapport à un formulaire statique.

> **À noter :**
> Même si vous utilisez des hooks (`useState`, `useEffect`, etc.) ou des états à la racine de votre configuration de formulaire, l’architecture de la bibliothèque garantit que le rendu reste optimisé.
> Grâce à l’utilisation de `React.memo` et à l’isolation des champs via le contexte de React Hook Form, **seuls les composants dont les props ou l’état changent réellement seront re-rendus**.
>
> Vous pouvez donc :
>
> - Générer dynamiquement vos champs à partir du contexte RHF,
> - Ou manipuler la configuration du formulaire via vos propres états,
>
> …tout en conservant des performances optimales et une indépendance de rendu entre les champs.

## Politique de gestion du style

La majorité des champs du formulaire s’appuie sur la bibliothèque de composants **ShadCN**, elle-même basée sur **Tailwind CSS**.
L’objectif est de centraliser la gestion des styles pour garantir cohérence et maintenabilité, tout en laissant la possibilité de gérer des exceptions au besoin.

### Bonnes pratiques pour la personnalisation du style

1. **Centralisation via la configuration Tailwind**
   Privilégiez la personnalisation de vos styles dans le fichier `tailwind.config.ts` (ou `postcss.config.mjs`).
   Cela permet d’appliquer des modifications globales et cohérentes à l’ensemble de l’UI.
2. **Surcharger les composants ShadCN**
   Si la personnalisation via Tailwind ne suffit pas, vous pouvez modifier directement les composants générés par ShadCN dans le dossier `ui` (créé lors de l’installation).
3. **Composants spécifiques au projet**
   Certains composants sont propres à ce projet : vous pouvez ajuster leur style directement dans le dossier `ReactFormMaker/enhancements`.
4. **Personnalisation ponctuelle via `className`**
   Pour des besoins très spécifiques, chaque champ accepte une prop `className` qui permet de surcharger le style au niveau du composant.
   Cette prop utilise la fonction utilitaire `cn` (issue de ShadCN, basée sur `clsx` et `twMerge`), permettant de fusionner et conditionner dynamiquement les classes CSS.

## FieldFactory, un atout pour simplifier le code

Dans de nombreux générateurs de formulaires, la configuration initiale se fait souvent sous forme de JSON. Si cette approche est universelle et flexible, elle atteint vite ses limites :

- Les formulaires complexes deviennent difficiles à lire et à maintenir,
- La logique métier (validation, comportements dynamiques) se retrouve dispersée ou dupliquée,
- L’absence de typage fort et d’outils d’autocomplétion nuit à la robustesse du code.

**FieldFactory** répond à ces problématiques en proposant une classe orientée objet pour la définition des champs de formulaire.

Elle sert de socle à des classes spécialisées (ex : `TextField`, `PasswordField`, etc.), permettant :

- Une configuration fluide et lisible grâce au chaînage de méthodes (`.setLabel()`, `.isEmail()`, etc.),
- L’application automatique de schémas Zod adaptés à chaque type de champ, facilitant la validation et la sécurité,
- L’extension facile : chaque type de champ peut avoir sa propre classe, encapsulant ses règles et comportements spécifiques,
- Une meilleure expérience développeur : autocomplétion, typage fort, documentation intégrée.

### Usage et utilité

**FieldFactory** permet de :

- **Définir des champs de formulaire de façon déclarative et expressive**
  Plutôt que de manipuler de gros objets JSON, vous pouvez construire vos champs avec une syntaxe fluide et lisible :

  ```typescript
  const emailField = new TextField('email')
    .setLabel('Adresse email')
    .isEmail()
    .setPlaceholder('Entrez votre email');
  ```

- **Centraliser la logique métier et la validation**
  Chaque classe spécialisée (ex : `TextField`) embarque ses propres règles de validation (Zod), ce qui évite la duplication et garantit la cohérence des règles métier.
- **Faciliter la maintenance et l’évolution**
  Ajouter un nouveau type de champ ou une nouvelle règle de validation devient trivial : il suffit d’étendre la classe de base ou d’ajouter une méthode.
- **Bénéficier d’un typage fort et d’une autocomplétion avancée**
  Grâce à TypeScript, l’utilisation de `FieldFactory` et de ses dérivés offre une expérience développeur optimale : moins d’erreurs, plus de productivité, et une documentation directement dans l’IDE.
- **Rendre la configuration évolutive**
  Pour des besoins simples, la configuration JSON reste possible. Mais pour des formulaires complexes, l’approche orientée objet permet d’aller beaucoup plus loin, sans sacrifier la lisibilité.
