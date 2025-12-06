
import { createApiResponseSchema } from "@src/schemas/api-response";
import { LabSampleTypeSchema } from "@src/schemas/lab-sample";
import * as v from "valibot";

export const CryoPackageResponseSchema = v.object({
  id: v.string(),
  packageName: v.string(),
  description: v.string(),
  price: v.number(),
  durationMonths: v.number(),
  maxSamples: v.number(),
  sampleType: LabSampleTypeSchema,
  includesInsurance: v.boolean(),
  insuranceAmount: v.number(),
  isActive: v.boolean(),
  benefits: v.string(),
  notes: v.string(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

export const CryoPackageApiResponseSchema = createApiResponseSchema(
  v.array(CryoPackageResponseSchema)
);

export type CryoPackageResponse = v.InferOutput<
  typeof CryoPackageResponseSchema
>;
export type CryoPackageApiResponse = v.InferOutput<
  typeof CryoPackageApiResponseSchema
>;
