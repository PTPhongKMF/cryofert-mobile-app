import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const TreatmentCycleSatus = v.picklist([
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
  orderIndex: v.number(),
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

///////////////////////////////////////////////////////////////////////

export const TreatmentCycleListApiResponseSchema = createApiResponseSchema(
  v.array(TreatmentCycleResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export type TreatmentCycleResponse = v.InferOutput<
  typeof TreatmentCycleResponseSchema
>;
export type TreatmentCycleListApiResponse = v.InferOutput<
  typeof TreatmentCycleListApiResponseSchema
>;
