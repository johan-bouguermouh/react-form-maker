/*
This code is heavily inspired by https://github.com/asteasolutions/zod-to-openapi/blob/master/src/zod-extensions.ts
 */

import { extendApi } from './zodRFM.class';
import { z } from 'zod';
import { SchemaObject } from './zodRFM.class';
import { ZodTypeDef } from 'zod';

declare module 'zod' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface ZodSchema<
    Output = any,
    Def extends ZodTypeDef = ZodTypeDef,
    Input = Output,
  > {
    rfm<T extends ZodSchema<Output, Def, Input>>(
      this: T,
      metadata: Partial<SchemaObject>,
    ): T;
  }
}

export function extendZodWithReactFormMaker(
  zod: typeof z,
  forceOverride = false,
) {
  if (!forceOverride && typeof zod.ZodSchema.prototype.rfm !== 'undefined') {
    return;
  }

  zod.ZodSchema.prototype.rfm = function (metadata?: Partial<SchemaObject>) {
    return extendApi(this, metadata);
  };
}

// on rend la fonction accessible depuis l'extérieur
