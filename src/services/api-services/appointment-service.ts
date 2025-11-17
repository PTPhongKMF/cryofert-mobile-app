import { format } from "@formkit/tempo";
import type { GenericApiResponse } from "@src/schemas/api-response";
import type { PatientBookingAppointmentApiResponse } from "@src/schemas/appointment";
import {
  PatientBookingAppointmentApiResponseSchema,
  type BookAppointmentRequest,
} from "@src/schemas/appointment";
import { httpClient } from "@src/services/api-services/http-service";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import * as v from "valibot";

export function useCreateBookingAppointmentMutation() {
  return useMutation<GenericApiResponse, HTTPError, BookAppointmentRequest>({
    mutationFn: async (req) => {
      console.log({
        patientId: req.patientId,
        doctorIds: [req.doctorIds],
        appointmentDate: req.appointmentDate,
        slotId: req.slotId,
        type: req.type,
        notes: req.notes,
      });
      return await httpClient
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
    },
    onError: async (e) => {
      console.log(await e.response.json());
    },
  });
}

export function usePatientBookingHistoryInfiniteQuery(
  patientId: string,
  pageSize: number = 20
) {
  return useInfiniteQuery<
    PatientBookingAppointmentApiResponse,
    HTTPError,
    InfiniteData<PatientBookingAppointmentApiResponse>,
    unknown[],
    number
  >({
    queryKey: ["PatientBookingHistoryInfinite", patientId, pageSize],
    queryFn: async (queryParams) => {
      const res = await httpClient
        .get(`api/appointment/patient/${patientId}/booking`, {
          searchParams: {
            type: "Booking",
            page: queryParams.pageParam,
            size: pageSize,
            sort: "createdAt",
            order: "desc",
          },
        })
        .json();

      return v.parse(PatientBookingAppointmentApiResponseSchema, res);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}
