import { createApiResponseSchema } from "@src/schemas/api-response";
import { SlotResponseSchema } from "@src/schemas/slot";
import { TransactionResponseSchema } from "@src/schemas/transaction";
import { TreatmentCycleSatus } from "@src/schemas/treatment-cycle";
import * as v from "valibot";

export const BookAppointmentFormSchema = v.object({
  doctorIds: v.string(),
  appointmentDate: v.pipe(v.string(), v.nonEmpty("Required")),
  slotId: v.pipe(v.string(), v.nonEmpty("Required")),
  // notes: v.string(),
});

export const BookAppointmentRequestSchema = v.object({
  ...BookAppointmentFormSchema.entries,
  patientId: v.pipe(v.string(), v.nonEmpty("Required")),
  type: v.literal("Booking"),
});

export const AppointmentResponseSchema = v.object({
  id: v.string(),
  treatmentCycleId: v.nullable(v.string()),
  slotId: v.nullable(v.string()),
  type: v.string(),
  typeName: v.string(),
  status: v.string(),
  statusName: v.string(),
  appointmentDate: v.string(),
  reason: v.nullable(v.string()),
  instructions: v.nullable(v.string()),
  notes: v.nullable(v.string()),
  checkInTime: v.nullable(v.string()),
  checkOutTime: v.nullable(v.string()),
  isReminderSent: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
  treatmentCycle: v.nullable(
    v.object({
      cycleName: v.string(),
      cycleNumber: v.number(),
      endDate: v.nullable(v.string()),
      id: v.string(),
      startDate: v.string(),
      status: TreatmentCycleSatus,
      treatment: v.object({ id: v.string() }),
    })
  ),
  slot: v.nullable(SlotResponseSchema),
  patient: v.nullable(
    v.object({
      id: v.string(),
      patientCode: v.string(),
      fullName: v.string(),
      phone: v.string(),
      email: v.string(),
    })
  ),
  doctors: v.array(
    v.object({
      id: v.string(),
      doctorId: v.string(),
      badgeId: v.string(),
      specialty: v.nullable(v.string()),
      fullName: v.string(),
      notes: v.nullable(v.string()),
    })
  ),
  doctorCount: v.number(),
  transactions: v.array(TransactionResponseSchema),
});

///////////////////////////////////////////////////////////////////////

export const AppointmentHistoryApiResponseSchema = createApiResponseSchema(
  v.array(AppointmentResponseSchema)
);

export const AppointmentApiResponseSchema = createApiResponseSchema(
  AppointmentResponseSchema
);

///////////////////////////////////////////////////////////////////////

export type BookAppointmentForm = v.InferOutput<
  typeof BookAppointmentFormSchema
>;
export type BookAppointmentRequest = v.InferOutput<
  typeof BookAppointmentRequestSchema
>;

export type AppointmentResponse = v.InferOutput<
  typeof AppointmentResponseSchema
>;
export type AppointmentHistoryApiResponse = v.InferOutput<
  typeof AppointmentHistoryApiResponseSchema
>;

export type AppointmentApiResponse = v.InferOutput<
  typeof AppointmentApiResponseSchema
>;
