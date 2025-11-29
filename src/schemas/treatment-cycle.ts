import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const TreatmentCycleSatus = v.picklist([
  "Planned",
  "InProgress",
  "Completed",
  "Cancelled",
  "OnHold",
  "Failed",
  "Scheduled",
]);

export const TreatmentCycleResponseSchema = v.object({
  id: v.string(),
  treatmentId: v.string(),
  cycleName: v.string(),
  cycleNumber: v.number(),
  stepType: v.string(),
  expectedDurationDays: v.number(),
  startDate: v.string(),
  endDate: v.nullable(v.string()),
  status: TreatmentCycleSatus,
  protocol: v.string(),
  notes: v.string(),
  cost: v.nullable(v.number()),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

export const TreatmentCycleDetailResponseSchema = v.object({
  ...TreatmentCycleResponseSchema.entries,
  patientId: v.string(),
  doctorId: v.string(),
  treatmentName: v.string(),
  appointments: v.array(v.object({
    id: v.string(),
    appointmentDate: v.string(),
    type: v.string(),
    status: v.string(),
  })),
  documents: v.array(v.unknown()),
});

///////////////////////////////////////////////////////////////////////

export const TreatmentCycleListApiResponseSchema = createApiResponseSchema(
  v.array(TreatmentCycleResponseSchema)
);

export const TreatmentCycleDetailApiResponseSchema = createApiResponseSchema(
  TreatmentCycleDetailResponseSchema
);

///////////////////////////////////////////////////////////////////////

export type TreatmentCycleResponse = v.InferOutput<
  typeof TreatmentCycleResponseSchema
>;
export type TreatmentCycleListApiResponse = v.InferOutput<
  typeof TreatmentCycleListApiResponseSchema
>;
export type TreatmentCycleDetailResponse = v.InferOutput<
  typeof TreatmentCycleDetailResponseSchema
>;
export type TreatmentCycleDetailApiResponse = v.InferOutput<
  typeof TreatmentCycleDetailApiResponseSchema
>;
