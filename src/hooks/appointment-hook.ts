import type {
  AppointmentApiResponse,
  AppointmentHistoryApiResponse,
} from "@src/schemas/appointment";
import type { BookAppointmentRequest } from "@src/schemas/appointment";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import {
  createBookingAppointmentMutationFn,
  appointmentHistoryQueryFn,
  appointmentDetailQueryFn,
} from "@src/services/api-services/appointment-service";
import { useLocalUserStore } from "@src/stores/user";
import { useAppointmentHistoryFilterStore } from "@src/stores/appointment";

export function useCreateBookingAppointmentMutation() {
  return useMutation<AppointmentApiResponse, HTTPError, BookAppointmentRequest>(
    {
      mutationFn: createBookingAppointmentMutationFn,
    }
  );
}

export function useAppointmentHistoryInfiniteQuery(
  patientId: string,
  pageSize: number = 20
) {
  const filterOptions = useAppointmentHistoryFilterStore((s) => s.filterOptions);

  return useInfiniteQuery<
    AppointmentHistoryApiResponse,
    HTTPError,
    InfiniteData<AppointmentHistoryApiResponse>,
    unknown[],
    number
  >({
    queryKey: [
      "PatientBookingHistoryInfinite",
      patientId,
      pageSize,
      filterOptions.type,
      filterOptions.status,
      filterOptions.sortType,
    ],
    queryFn: (queryParams) =>
      appointmentHistoryQueryFn({
        patientId,
        pageSize,
        pageParam: queryParams.pageParam,
        type: filterOptions.type ?? undefined,
        status: filterOptions.status ?? undefined,
        sortType: filterOptions.sortType,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}

export function useAppointmentDetailQuery(appointmentId: string) {
  return useQuery<AppointmentApiResponse, HTTPError>({
    queryKey: ["api/appointment/details", appointmentId],
    queryFn: () => appointmentDetailQueryFn({ appointmentId }),
    enabled: !!appointmentId,
  });
}
