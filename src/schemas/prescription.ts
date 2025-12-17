import * as v from "valibot";

export const PrescriptionItemResponseSchema = v.object({
  id: v.string(),

  medicineId: v.string(),
  medicineName: v.nullable(v.string()),
  dosage: v.nullable(v.string()),
  form: v.nullable(v.string()),

  quantity: v.number(),
  frequency: v.nullable(v.string()),
  durationDays: v.nullable(v.number()),
  instructions: v.nullable(v.string()),
  notes: v.nullable(v.string()),
});

export const PrescriptionResponseSchema = v.object({
  id: v.string(),

  medicalRecordId: v.string(),
  medicalRecordDiagnosis: v.nullable(v.string()),

  prescriptionDate: v.string(),
  diagnosis: v.nullable(v.string()),
  instructions: v.nullable(v.string()),
  notes: v.nullable(v.string()),

  isFilled: v.boolean(),
  filledDate: v.nullable(v.string()),

  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

export const PrescriptionDetailResponseSchema = v.object({
  ...PrescriptionResponseSchema.entries,
  prescriptionDetails: v.nullable(v.array(PrescriptionItemResponseSchema)),
});

///////////////////////////////////////////////////////////////////////

export type PrescriptionItemResponse = v.InferOutput<
  typeof PrescriptionItemResponseSchema
>;
export type PrescriptionResponse = v.InferOutput<
  typeof PrescriptionResponseSchema
>;
export type PrescriptionDetailResponse = v.InferOutput<
  typeof PrescriptionDetailResponseSchema
>;

