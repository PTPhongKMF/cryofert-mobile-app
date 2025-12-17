import { createApiResponseSchema } from "@src/schemas/api-response";
import { MediaResponseSchema } from "@src/schemas/media";
import { PrescriptionDetailResponseSchema } from "@src/schemas/prescription";
import * as v from "valibot";

export const MedicalRecordResponseSchema = v.object({
  id: v.string(),
  appointmentId: v.string(),
  chiefComplaint: v.nullable(v.string()),
  history: v.nullable(v.string()),
  physicalExamination: v.nullable(v.string()),
  diagnosis: v.nullable(v.string()),
  treatmentPlan: v.nullable(v.string()),
  followUpInstructions: v.nullable(v.string()),
  vitalSigns: v.nullable(v.string()),
  labResults: v.nullable(v.string()),
  imagingResults: v.nullable(v.string()),
  notes: v.nullable(v.string()),
  appointmentDate: v.string(),
  patientId: v.nullable(v.string()),
  patientName: v.nullable(v.string()),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
  prescriptions: v.nullable(v.array(PrescriptionDetailResponseSchema)),
  medias: v.nullable(v.array(MediaResponseSchema)),
});

///////////////////////////////////////////////////////////////////////

export const MedicalRecordApiResponseSchema = createApiResponseSchema(
  v.array(MedicalRecordResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export type MedicalRecordResponse = v.InferOutput<
  typeof MedicalRecordResponseSchema
>;

export type MedicalRecordApiResponse = v.InferOutput<
  typeof MedicalRecordApiResponseSchema
>;

