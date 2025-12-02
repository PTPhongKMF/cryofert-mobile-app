import { format } from "@formkit/tempo";
import type {
  AppointmentApiResponse,
  AppointmentHistoryApiResponse,
} from "@src/schemas/appointment";
import {
  AppointmentApiResponseSchema,
  AppointmentHistoryApiResponseSchema,
  type BookAppointmentRequest,
} from "@src/schemas/appointment";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import { getDateOnly } from "@src/utils/date";

export async function createBookingAppointmentMutationFn(
  req: BookAppointmentRequest
) {
  const res = await httpClient
    .post("api/appointment", {
      json: {
        patientId: req.patientId,
        doctorIds: req.doctorIds ? [req.doctorIds] : undefined,
        appointmentDate: format(req.appointmentDate, "YYYY-MM-DD"),
        slotId: req.slotId,
        type: req.type,
        // notes: req.notes,
      },
    })
    .json();

  console.log(res);

  return v.parse(AppointmentApiResponseSchema, res);
}

export async function appointmentHistoryQueryFn(params: {
  patientId: string;
  type?: string;
  status?: string;
  sortType: "Lastest" | "Upcomming";
  pageSize: number;
  pageParam: number;
}): Promise<AppointmentHistoryApiResponse> {
  const isUpcoming = params.sortType === "Upcomming";

  const res = await httpClient
    .get(`api/appointment/patient/${params.patientId}/history`, {
      searchParams: {
        type: params.type,
        status: params.status,
        page: params.pageParam,
        size: params.pageSize,
        sort: "createdAt",
        order: "desc",
        ...(isUpcoming && {
          appointmentDateFrom: getDateOnly(new Date().toISOString()),
          sort: "appointmentDate",
          order: "asc",
        }),
      },
    })
    .json();

  return v.parse(AppointmentHistoryApiResponseSchema, res);
}

export async function appointmentDetailQueryFn(params: {
  appointmentId: string;
}): Promise<AppointmentApiResponse> {
  const res = await httpClient
    .get(`api/appointment/${params.appointmentId}/details`)
    .json();

  console.log(res);

  return v.parse(AppointmentApiResponseSchema, res);
}
