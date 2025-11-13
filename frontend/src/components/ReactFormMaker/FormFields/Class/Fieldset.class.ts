import type {
  DividerReactFormMaker,
  FieldReactFormMaker,
  ReactFormMakerFieldset,
} from '../../interfaces/FieldInterfaces';

type includedField =
  | FieldReactFormMaker
  | DividerReactFormMaker
  | ReactFormMakerFieldset
  | includedField[];

/**
 * **FieldSet class**: This class is used to create a fieldset in a form.
 *
 * ---
 * *This class helps to formalize and structure a configuration for using React Form Macker, with an abstraction layer that facilitates use.*
 *
 * ---
 *
 * * @example
 *
 * ```ts
 *
 * const login = new Field('login').text();
 * const password = new Field('password').password();
 *
 *
 * const fieldset = new FieldSet(
 *    'login', //name of the fieldset
 *    { // Simple configuration of the fieldset
 *      legend: 'Login',
 *      className: 'w-full flex flex-col gap-4',
 *      legendClassName: 'text-lg font-bold',
 *    },
 *    [login, password] // Fields of the fieldset
 * )
 *
 * ```
 *
 * ---
 * * @param formName - The name of the fieldset.
 * * @param entries - The configuration of the fieldset.
 * * @param fields - The fields of the fieldset.
 *
 * ---
 *
 * @Advanced
 *
 * *You can use a Fasted div on horizontal mode to create a divider between fields. The divider is a field that contains other fields. You can use it to group fields together.*
 *
 * ```ts
 *
 * const login = new Field('login').text();
 * const password = new Field('password').password();
 * const firstName = new Field('firstName').text();
 * const lastName = new Field('lastName').text();
 *
 * const fieldset = new FieldSet(
 *   'register', //name of the fieldset
 *  {},
 *  [ login, [ firstName, lastName ], password ] // Fields of the fieldset : lastName and firstName are grouped together in a divider in a horizontal mode
 *
 *
 */
export default class FieldSet<T extends Partial<ReactFormMakerFieldset>> {
  fieldset: string = '';
  legend?: string;
  legendClassName?: string;
  className?: string;
  fields?: (
    | FieldReactFormMaker
    | DividerReactFormMaker
    | ReactFormMakerFieldset
  )[];
  isHide?: boolean;

  constructor(formName: string, entries: T, fields: includedField[]) {
    this.fieldset = formName;
    if (entries) Object.assign(this, entries);
    this.fields = fields.map((entry) => this.parseIncludedField(entry));
  }

  private parseIncludedField(
    entries: includedField[] | includedField,
  ): FieldReactFormMaker | DividerReactFormMaker | ReactFormMakerFieldset {
    if (!Array.isArray(entries)) {
      return entries;
    }

    let newDivider = {
      isDiv: true,
      className: 'w-full flex gap-4 justify-between',
      fields: [],
    } as DividerReactFormMaker;

    entries.forEach((entry) => {
      if (!entry) return;
      newDivider.fields
        ? newDivider.fields.push(this.parseIncludedField(entry))
        : (newDivider.fields = [this.parseIncludedField(entry)]);
    });

    return newDivider;
  }

  public setConfig(config: Partial<T>): this {
    Object.assign(this, config);
    return this;
  }

  /**
   * **Define the legend of the fieldset**
   * @param legend
   * @returns
   */
  public setLegend(legend: string): this {
    this.legend = legend;
    return this;
  }

  /**
   * **Define the class of the legend**
   * @param legendClassName
   * @returns
   */
  public legendClass(legendClassName: string): this {
    this.legendClassName = legendClassName;
    return this;
  }

  /**
   * **Define the class of the fieldset**
   * @param className
   * @returns
   */
  public class = (className: string): this => {
    this.className = className;
    return this;
  };
}
