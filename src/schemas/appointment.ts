import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const BookAppointmentFormSchema = v.object({
  appointmentDate: v.pipe(v.string(), v.nonEmpty("Required")),
  slotId: v.pipe(v.string(), v.nonEmpty("Required")),
  notes: v.string(),
});

export const BookAppointmentRequestSchema = v.object({
  ...BookAppointmentFormSchema.entries,
  patientId: v.pipe(v.string(), v.nonEmpty("Required")),
  type: v.literal("Booking"),
});

export const PatientBookingAppointmentResponseSchema = v.object({
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
  treatmentCycle: v.nullable(v.unknown()),
  slot: v.nullable(v.object({ startTime: v.string(), endTime: v.string() })),
  patient: v.object({
    id: v.string(),
    patientCode: v.string(),
    fullName: v.string(),
    phone: v.string(),
    email: v.string(),
  }),
  doctors: v.array(v.unknown()),
  doctorCount: v.number(),
});

///////////////////////////////////////////////////////////////////////

export const PatientBookingAppointmentApiResponseSchema =
  createApiResponseSchema(v.array(PatientBookingAppointmentResponseSchema));

///////////////////////////////////////////////////////////////////////

export type BookAppointmentForm = v.InferOutput<
  typeof BookAppointmentFormSchema
>;
export type BookAppointmentRequest = v.InferOutput<
  typeof BookAppointmentRequestSchema
>;

export type PatientBookingAppointmentResponse = v.InferOutput<
  typeof PatientBookingAppointmentResponseSchema
>;
export type PatientBookingAppointmentApiResponse = v.InferOutput<
  typeof PatientBookingAppointmentApiResponseSchema
>;
