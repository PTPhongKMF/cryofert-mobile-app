import type {
  BookingAppointmentApiResponse,
  PatientBookingAppointmentApiResponse,
} from "@src/schemas/appointment";
import type { BookAppointmentRequest } from "@src/schemas/appointment";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import {
  createBookingAppointmentMutationFn,
  patientBookingHistoryQueryFn,
} from "@src/services/api-services/appointment-service";

export function useCreateBookingAppointmentMutation() {
  return useMutation<
    BookingAppointmentApiResponse,
    HTTPError,
    BookAppointmentRequest
  >({
    mutationFn: createBookingAppointmentMutationFn,
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
    queryFn: (queryParams) =>
      patientBookingHistoryQueryFn({
        patientId,
        pageSize,
        pageParam: queryParams.pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}
