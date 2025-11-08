import * as v from "valibot";

export function createApiResponseSchema<TSchema extends v.GenericSchema>(
  dataSchema: TSchema
) {
  return v.object({
    code: v.pipe(v.number(), v.integer()),
    systemCode: v.nullable(v.string()),
    message: v.string(),
    data: dataSchema,
    timestamp: v.optional(v.pipe(v.string(), v.isoTimestamp())),
    success: v.optional(v.boolean()),
  });
}

export const GenericApiResponseSchema = createApiResponseSchema(v.unknown());
export type GenericApiResponse = v.InferOutput<typeof GenericApiResponseSchema>;
