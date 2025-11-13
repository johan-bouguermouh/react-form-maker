import { z, AnyZodObject, ZodTypeAny } from 'zod';
import { merge } from 'ts-deepmerge';
import type { ReactFormMakerFieldset } from '../interfaces/FieldInterfaces';

export interface ReferenceObject {
  $ref: string;
  summary?: string;
  description?: string;
}

export type SchemaObjectType =
  | 'integer'
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'null'
  | 'array';

export type SchemaObject = Partial<ReactFormMakerFieldset> & {
  type?: SchemaObjectType | SchemaObjectType[];
  format?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  multipleOf?: number;
  additionalProperties?: Partial<SchemaObject> | ReferenceObject | boolean;
  minItems?: number;
  maxItems?: number;
  oneOf?: SchemaObject[];
  allOf?: SchemaObject[];
  enum?: any[];
  readOnly?: boolean;
  description?: string;
};

type RFMchemaObject = SchemaObject & { hideDefinitions?: string[] };

interface RFMZodAny extends ZodTypeAny {
  metaReactFormMaker?: Partial<ReactFormMakerFieldset>;
}

interface RFMAnyObject extends AnyZodObject {
  metaReactFormMaker?: Partial<ReactFormMakerFieldset>;
}

type RFMVersion = '1' | '1.2';

interface ParsingArgs<T> {
  zodRef: T;
  schemas: RFMAnyObject[];
  useOutput?: boolean;
  hideDefinitions?: string[];
  RFMVersion: RFMVersion;
}

export function extendApi<T extends RFMZodAny>(
  schema: T,
  schemaObject: Partial<ReactFormMakerFieldset> = {},
): T {
  const This = (schema as any).constructor;
  const newSchema = new This(schema._def);
  newSchema.metaOpenApi = Object.assign(
    {},
    schema.metaReactFormMaker || {},
    schemaObject,
  );
  return newSchema;
}

function iterateZodObject({
  zodRef,
  useOutput,
  hideDefinitions,
  RFMVersion,
}: ParsingArgs<RFMAnyObject>) {
  const reduced = Object.keys(zodRef.shape)
    .filter((key) => hideDefinitions?.includes(key) === false)
    .reduce(
      (carry, key) => ({
        ...carry,
        [key]: generateSchema(zodRef.shape[key], useOutput, RFMVersion),
      }),
      {} as Record<string, SchemaObject>,
    );

  return reduced;
}

function typeFormat<const T extends SchemaObjectType>(
  type: T,
  openApiVersion: RFMVersion,
) {
  return openApiVersion === '1' ? type : [type];
}

function parseTransformation({
  zodRef,
  schemas,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodTransformer<never> | z.ZodEffects<never>>): SchemaObject {
  const input = generateSchema(zodRef._def.schema, useOutput, RFMVersion);
  let output = 'undefined';
  if (useOutput && zodRef._def.effect) {
    const effect =
      zodRef._def.effect.type === 'transform' ? zodRef._def.effect : null;
    if (effect && 'transform' in effect) {
      try {
        const type = Array.isArray(input.type) ? input.type[0] : input.type;
        output = typeof effect.transform(
          ['integer', 'number'].includes(`${type}`)
            ? 0
            : 'string' === type
              ? ''
              : 'boolean' === type
                ? false
                : 'object' === type
                  ? {}
                  : 'null' === type
                    ? null
                    : 'array' === type
                      ? []
                      : undefined,
          { addIssue: () => undefined, path: [] }, // TODO: Discover if context is necessary here
        );
      } catch (e) {
        /**/
      }
    }
  }
  const outputType = output as 'number' | 'string' | 'boolean' | 'null';
  return merge(
    {
      ...(zodRef.description ? { description: zodRef.description } : {}),
      ...input,
      ...(['number', 'string', 'boolean', 'null'].includes(output)
        ? {
            type: typeFormat(outputType, RFMVersion),
          }
        : {}),
    },
    ...schemas,
  );
}

function parseString({
  zodRef,
  schemas,
  RFMVersion,
}: ParsingArgs<z.ZodString>): SchemaObject {
  const baseSchema: SchemaObject = {
    type: typeFormat('string', RFMVersion),
  };
  const { checks = [] } = zodRef._def;
  checks.forEach((item) => {
    switch (item.kind) {
      case 'email':
        baseSchema.format = 'email';
        break;
      case 'uuid':
        baseSchema.format = 'uuid';
        break;
      case 'cuid':
        baseSchema.format = 'cuid';
        break;
      case 'url':
        baseSchema.format = 'uri';
        break;
      case 'datetime':
        baseSchema.format = 'date-time';
        break;
      case 'length':
        baseSchema.minLength = item.value;
        baseSchema.maxLength = item.value;
        break;
      case 'max':
        baseSchema.maxLength = item.value;
        break;
      case 'min':
        baseSchema.minLength = item.value;
        break;
      case 'regex':
        baseSchema.pattern = item.regex.source;
        break;
    }
  });
  return merge(
    baseSchema,
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseNumber({
  zodRef,
  schemas,
  RFMVersion,
}: ParsingArgs<z.ZodNumber>): SchemaObject {
  const baseSchema: SchemaObject = {
    type: typeFormat('number', RFMVersion),
  };
  const { checks = [] } = zodRef._def;
  checks.forEach((item) => {
    switch (item.kind) {
      case 'max':
        if (item.inclusive) baseSchema.maximum = item.value;
        else baseSchema.exclusiveMaximum = item.value;
        break;
      case 'min':
        if (item.inclusive) baseSchema.minimum = item.value;
        else baseSchema.exclusiveMinimum = item.value;
        break;
      case 'int':
        baseSchema.type = typeFormat('integer', RFMVersion);
        break;
      case 'multipleOf':
        baseSchema.multipleOf = item.value;
        break;
    }
  });
  return merge(
    baseSchema,
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function getExcludedDefinitionsFromSchema(schemas: any): string[] {
  const excludedDefinitions = [];
  for (const schema of schemas) {
    if (Array.isArray(schema.hideDefinitions)) {
      excludedDefinitions.push(...schema.hideDefinitions);
    }
  }

  return excludedDefinitions;
}

function parseObject({
  zodRef,
  schemas,
  useOutput,
  hideDefinitions,
  RFMVersion,
}: ParsingArgs<
  z.ZodObject<never, 'passthrough' | 'strict' | 'strip'>
>): SchemaObject {
  let additionalProperties: SchemaObject['additionalProperties'];

  // `catchall` obviates `strict`, `strip`, and `passthrough`
  if (
    !(
      zodRef._def.catchall instanceof z.ZodNever ||
      zodRef._def.catchall?._def.typeName === 'ZodNever'
    )
  ) {
    additionalProperties = generateSchema(
      zodRef._def.catchall,
      useOutput,
      RFMVersion,
    );
  } else if (zodRef._def.unknownKeys === 'passthrough') {
    additionalProperties = true;
  } else if (zodRef._def.unknownKeys === 'strict') {
    additionalProperties = false;
  }

  // So that `undefined` values don't end up in the schema and be weird
  additionalProperties =
    additionalProperties != null ? additionalProperties : {};

  const requiredProperties = Object.keys(
    (zodRef as z.AnyZodObject).shape,
  ).filter((key) => {
    const item = (zodRef as z.AnyZodObject).shape[key];
    return (
      !(
        item.isOptional() ||
        item instanceof z.ZodDefault ||
        item._def.typeName === 'ZodDefault'
      ) && !(item instanceof z.ZodNever || item._def.typeName === 'ZodDefault')
    );
  });

  const required =
    requiredProperties.length > 0 ? { required: requiredProperties } : {};

  return merge(
    {
      type: typeFormat('object', RFMVersion),
      properties: iterateZodObject({
        zodRef: zodRef as RFMAnyObject,
        schemas,
        useOutput,
        hideDefinitions: getExcludedDefinitionsFromSchema(schemas),
        RFMVersion,
      }),
      ...required,
      additionalProperties,
      ...hideDefinitions,
    },
    zodRef.description
      ? { description: zodRef.description, hideDefinitions }
      : {},
    ...schemas,
  );
}

function parseRecord({
  zodRef,
  schemas,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodRecord>): SchemaObject {
  return merge(
    {
      type: typeFormat('object', RFMVersion),
      additionalProperties:
        zodRef._def.valueType instanceof z.ZodUnknown
          ? true
          : generateSchema(zodRef._def.valueType, useOutput, RFMVersion),
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseBigInt({
  zodRef,
  schemas,
  RFMVersion,
}: ParsingArgs<z.ZodBigInt>): SchemaObject {
  return merge(
    {
      type: typeFormat('integer', RFMVersion),
      format: 'int64',
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseBoolean({
  zodRef,
  schemas,
  RFMVersion,
}: ParsingArgs<z.ZodBoolean>): SchemaObject {
  return merge(
    { type: typeFormat('boolean', RFMVersion) },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseDate({
  zodRef,
  schemas,
  RFMVersion,
}: ParsingArgs<z.ZodDate>): SchemaObject {
  return merge(
    {
      type: typeFormat('string', RFMVersion),
      format: 'date-time',
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseNull({
  zodRef,
  schemas,
  RFMVersion,
}: ParsingArgs<z.ZodNull>): SchemaObject {
  return merge(
    RFMVersion === '1'
      ? { type: 'null' as SchemaObjectType }
      : {
          type: ['string', 'null'] as SchemaObjectType[],
          enum: ['null'],
        },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseOptional({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodOptional<RFMZodAny>>): SchemaObject {
  return merge(
    generateSchema(zodRef.unwrap(), useOutput, RFMVersion),
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseNullable({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodNullable<RFMZodAny>>): SchemaObject {
  const schema = generateSchema(zodRef.unwrap(), useOutput, RFMVersion);
  return merge(
    schema,
    { type: typeFormat('null', RFMVersion) },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseDefault({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodDefault<RFMZodAny>>): SchemaObject {
  return merge(
    {
      default: zodRef._def.defaultValue(),
      ...generateSchema(zodRef._def.innerType, useOutput, RFMVersion),
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseArray({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodArray<RFMZodAny>>): SchemaObject {
  const constraints: Partial<SchemaObject> = {};
  if (zodRef._def.exactLength != null) {
    constraints.minItems = zodRef._def.exactLength.value;
    constraints.maxItems = zodRef._def.exactLength.value;
  }

  if (zodRef._def.minLength != null)
    constraints.minItems = zodRef._def.minLength.value;
  if (zodRef._def.maxLength != null)
    constraints.maxItems = zodRef._def.maxLength.value;

  return merge(
    {
      type: typeFormat('array', RFMVersion),
      items: generateSchema(zodRef.element, useOutput, RFMVersion),
      ...constraints,
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseLiteral({
  schemas,
  zodRef,
  RFMVersion,
}: ParsingArgs<z.ZodLiteral<RFMZodAny>>): SchemaObject {
  const type = typeof zodRef._def.value as 'string' | 'number' | 'boolean';
  return merge(
    {
      type: typeFormat(type, RFMVersion),
      enum: [zodRef._def.value],
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseEnum({
  schemas,
  zodRef,
  RFMVersion,
}: ParsingArgs<z.ZodEnum<never> | z.ZodNativeEnum<never>>): SchemaObject {
  const type = typeof Object.values(zodRef._def.values)[0] as
    | 'string'
    | 'number';
  return merge(
    {
      type: typeFormat(type, RFMVersion),
      enum: Object.values(zodRef._def.values),
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseIntersection({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodIntersection<z.ZodTypeAny, z.ZodTypeAny>>): SchemaObject {
  return merge(
    {
      type: typeFormat('object', RFMVersion),
      allOf: [
        generateSchema(zodRef._def.left, useOutput, RFMVersion),
        generateSchema(zodRef._def.right, useOutput, RFMVersion),
      ],
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseUnion({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodUnion<[z.ZodTypeAny, ...z.ZodTypeAny[]]>>): SchemaObject {
  const contents = zodRef._def.options;
  if (
    contents.reduce(
      (prev, content) => prev && content._def.typeName === 'ZodLiteral',
      true,
    )
  ) {
    // special case to transform unions of literals into enums
    const literals = contents as unknown as z.ZodLiteral<RFMZodAny>[];
    const type = literals.reduce(
      (prev, content) =>
        !prev || prev === typeof content._def.value
          ? typeof content._def.value
          : null,
      null as null | string,
    );

    if (type) {
      const baseSchema: SchemaObject = {
        type: typeFormat(type as SchemaObjectType, RFMVersion),
        enum: literals.map((literal) => literal._def.value),
      };

      const descriptionSchema = zodRef.description
        ? { description: zodRef.description }
        : {};

      return merge(baseSchema, descriptionSchema, ...schemas);
    }
  }

  const baseSchema: SchemaObject = {
    oneOf: contents.map((schema) =>
      generateSchema(schema, useOutput, RFMVersion),
    ),
  };

  const descriptionSchema = zodRef.description
    ? { description: zodRef.description }
    : {};

  return merge(baseSchema, descriptionSchema, ...schemas);
}

function parseDiscriminatedUnion({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<
  z.ZodDiscriminatedUnion<string, z.ZodDiscriminatedUnionOption<string>[]>
>): SchemaObject {
  return merge(
    {
      discriminator: {
        propertyName: (
          zodRef as z.ZodDiscriminatedUnion<
            string,
            z.ZodDiscriminatedUnionOption<string>[]
          >
        )._def.discriminator,
      },
      oneOf: Array.from(
        (
          zodRef as z.ZodDiscriminatedUnion<
            string,
            z.ZodDiscriminatedUnionOption<string>[]
          >
        )._def.options.values(),
      ).map((schema) => generateSchema(schema, useOutput, RFMVersion)),
    },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseNever({
  zodRef,
  schemas,
}: ParsingArgs<z.ZodNever>): SchemaObject {
  return merge(
    { readOnly: true },
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function parseBranded({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodBranded<z.ZodAny, string>>): SchemaObject {
  return merge(
    generateSchema(zodRef._def.type, useOutput, RFMVersion),
    ...schemas,
  );
}

function parsePipeline({
  schemas,
  zodRef,
  useOutput,
  RFMVersion,
}: ParsingArgs<z.ZodPipeline<never, never>>): SchemaObject {
  return merge(
    generateSchema(
      useOutput ? zodRef._def.out : zodRef._def.in,
      useOutput,
      RFMVersion,
    ),
    ...schemas,
  );
}

function parseReadonly({
  zodRef,
  useOutput,
  schemas,
  RFMVersion,
}: ParsingArgs<z.ZodReadonly<z.ZodAny>>): SchemaObject {
  return merge(
    generateSchema(zodRef._def.innerType, useOutput, RFMVersion),
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

function catchAllParser({
  zodRef,
  schemas,
}: ParsingArgs<ZodTypeAny>): SchemaObject {
  return merge(
    zodRef.description ? { description: zodRef.description } : {},
    ...schemas,
  );
}

const workerMap = {
  ZodObject: parseObject,
  ZodRecord: parseRecord,
  ZodString: parseString,
  ZodNumber: parseNumber,
  ZodBigInt: parseBigInt,
  ZodBoolean: parseBoolean,
  ZodDate: parseDate,
  ZodNull: parseNull,
  ZodOptional: parseOptional,
  ZodNullable: parseNullable,
  ZodDefault: parseDefault,
  ZodArray: parseArray,
  ZodLiteral: parseLiteral,
  ZodEnum: parseEnum,
  ZodNativeEnum: parseEnum,
  ZodTransformer: parseTransformation,
  ZodEffects: parseTransformation,
  ZodIntersection: parseIntersection,
  ZodUnion: parseUnion,
  ZodDiscriminatedUnion: parseDiscriminatedUnion,
  ZodNever: parseNever,
  ZodBranded: parseBranded,
  // TODO Transform the rest to schemas
  ZodUndefined: catchAllParser,
  // TODO: `prefixItems` is allowed in OpenAPI 3.1 which can be used to create tuples
  ZodTuple: catchAllParser,
  ZodMap: catchAllParser,
  ZodFunction: catchAllParser,
  ZodLazy: catchAllParser,
  ZodPromise: catchAllParser,
  ZodAny: catchAllParser,
  ZodUnknown: catchAllParser,
  ZodVoid: catchAllParser,
  ZodPipeline: parsePipeline,
  ZodReadonly: parseReadonly,
};
type WorkerKeys = keyof typeof workerMap;

export function generateSchema(
  zodRef: RFMZodAny,
  useOutput = false,
  RFMVersion: RFMVersion = '1',
): SchemaObject {
  const { metaReactFormMaker = {} } = zodRef;
  const schemas = [
    ...(Array.isArray(metaReactFormMaker)
      ? metaReactFormMaker
      : [metaReactFormMaker]),
  ];
  try {
    const typeName = zodRef._def.typeName as WorkerKeys;
    if (typeName in workerMap) {
      return workerMap[typeName]({
        zodRef: zodRef as never,
        schemas,
        useOutput,
        RFMVersion,
      });
    }

    return catchAllParser({ zodRef, schemas, RFMVersion });
  } catch (err) {
    console.error(err);
    return catchAllParser({ zodRef, schemas, RFMVersion });
  }
}
