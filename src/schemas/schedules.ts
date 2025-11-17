import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const DoctorScheduleBusyResponseSchema = v.object({
  doctorId: v.string(),
  scheduleByDate: v.array(
    v.object({
      workDate: v.string(),
      slotIds: v.array(v.string()),
      totalSlots: v.number(),
    })
  ),
});

/////////////////////////////////////////////////////////////////////////////

export const DoctorScheduleBusyApiResponseSchema = createApiResponseSchema(
  DoctorScheduleBusyResponseSchema
);

/////////////////////////////////////////////////////////////////////////////

export type DoctorScheduleBusyResponse = v.InferOutput<
  typeof DoctorScheduleBusyResponseSchema
>;
export type DoctorScheduleBusyApiResponse = v.InferOutput<
  typeof DoctorScheduleBusyApiResponseSchema
>;
