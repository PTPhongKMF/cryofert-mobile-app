import { format } from "@formkit/tempo";
import type { GenericApiResponse } from "@src/schemas/api-response";
import type { PatientBookingAppointmentApiResponse } from "@src/schemas/appointment";
import {
  PatientBookingAppointmentApiResponseSchema,
  type BookAppointmentRequest,
} from "@src/schemas/appointment";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function createBookingAppointmentMutationFn(
  req: BookAppointmentRequest
): Promise<GenericApiResponse> {
  const res = await httpClient
    .post("api/appointment", {
      json: {
        patientId: req.patientId,
        doctorIds: req.doctorIds ? [req.doctorIds] : undefined,
        appointmentDate: format(req.appointmentDate, "YYYY-MM-DD"),
        slotId: req.slotId,
        type: req.type,
        notes: req.notes,
      },
    })
    .json();

  return res as GenericApiResponse;
}

export async function patientBookingHistoryQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
}): Promise<PatientBookingAppointmentApiResponse> {
  const res = await httpClient
    .get(`api/appointment/patient/${params.patientId}/booking`, {
      searchParams: {
        type: "Booking",
        page: params.pageParam,
        size: params.pageSize,
        sort: "createdAt",
        order: "desc",
      },
    })
    .json();

  return v.parse(PatientBookingAppointmentApiResponseSchema, res);
}
