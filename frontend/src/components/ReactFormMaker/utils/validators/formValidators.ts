import { CompositeField } from '../../interfaces/FieldInterfaces';
import { isStepReactFormMaker } from '../typeGuards/compositeField.TypeGuards';

/**
 * **Validate Stepper Form Fields**
 * Rule :
 *  - Warn if the form contains only one step.
 *  - Error if the form contains no step.
 * - - -
 * @param formfields - Les champs de formulaire à valider.
 * @param stepper - Le boolean indiquant si le formulaire utilise un stepper.
 * @returns Vrai si la validation passe, sinon une erreur ou un avertissement est lancé.
 */
export default function validateStepperFormFields(
  formfields: CompositeField[],
  stepper: boolean,
): void {
  if (stepper) {
    const stepFields = formfields.filter(isStepReactFormMaker);
    if (stepFields.length < 1) {
      throw new Error(
        'Le formulaire doit contenir au moins un champ de type "ReactFormMakerStep" lorsque le stepper est activé.',
      );
    } else if (stepFields.length === 1) {
      console.warn(
        'Le formulaire contient seulement un champ de type "ReactFormMakerStep". Le stepper n\'est pas utile avec une seule étape.',
      );
    }
  }
}
