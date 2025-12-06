import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const LabSampleTypes = ["Oocyte", "Sperm", "Embryo"] as const;
export const LabSampleTypeSchema = v.picklist(LabSampleTypes);

export const LabSampleStatuses = [
  "Stored",
  "QualityChecked",
  "Fertilized",
  "Used",
  "CulturedEmbryo",
  "Collected",
  "Frozen",
  "Disposed",
  "Thawed",
] as const;
const LabSampleStatusSchema = v.picklist(LabSampleStatuses);

export const LabSampleSortTypes = ["LatestCollection", "ExpirySoon"] as const;
export type LabSampleSortType = (typeof LabSampleSortTypes)[number];

export const LabSampleResponseSchema = v.object({
  id: v.string(),
  patientId: v.string(),
  sampleCode: v.string(),
  sampleType: LabSampleTypeSchema,
  status: LabSampleStatusSchema,
  collectionDate: v.string(),
  isAvailable: v.boolean(),
  isStoraged: v.boolean(),
  storageDate: v.nullable(v.string()),
  expiryDate: v.nullable(v.string()),
  quality: v.nullable(v.string()),
  notes: v.nullable(v.string()),
});

export const LabSampleListApiResponseSchema = createApiResponseSchema(
  v.array(LabSampleResponseSchema)
);

export type LabSampleResponse = v.InferOutput<typeof LabSampleResponseSchema>;
export type LabSampleListApiResponse = v.InferOutput<
  typeof LabSampleListApiResponseSchema
>;
export type LabSampleType = v.InferOutput<typeof LabSampleTypeSchema>;
export type LabSampleStatus = v.InferOutput<typeof LabSampleStatusSchema>;
