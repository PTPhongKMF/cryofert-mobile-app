import type { GenericApiResponse } from "@src/schemas/api-response";
import type { PatientBookingAppointmentApiResponse } from "@src/schemas/appointment";
import {
  PatientBookingAppointmentApiResponseSchema,
  type BookAppointmentRequest,
} from "@src/schemas/appointment";
import { httpClient } from "@src/services/api-services/http-service";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import * as v from "valibot";

export function useBookingAppointmentMutation() {
  return useMutation<GenericApiResponse, HTTPError, BookAppointmentRequest>({
    mutationFn: async (req) => {
      return await httpClient
        .post("api/appointment", {
          json: {
            // patientId: req.patientId,
            patientId: "00000000-0000-0000-0000-000000030004",
            appointmentDate: req.appointmentDate,
            slotId: req.slotId,
            type: req.type,
            notes: req.notes,
          },
        })
        .json();
    },
  });
}

export function usePatientBookingHistoryQuery() {
  return useQuery<PatientBookingAppointmentApiResponse, HTTPError>({
    queryKey: ["PatientBookingHistory"],
    queryFn: async () => {
      const res = await httpClient
        .get(
          `api/appointment/patient/00000000-0000-0000-0000-000000030004/booking`,
          { searchParams: { Sort: "createdAt", Order: "desc" } }
        )
        .json();

      console.log(res);
      return v.parse(PatientBookingAppointmentApiResponseSchema, res);
    },
  });
}
