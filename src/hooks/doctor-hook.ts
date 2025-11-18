import type { DoctorApiResponse } from "@src/schemas/doctor";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import {
  doctorAvailableQueryFn,
  doctorInfiniteQueryFn,
} from "@src/services/api-services/doctor-service";

export function useDoctorInfiniteQuery(
  searchTerm: string,
  pageSize: number = 20
) {
  return useInfiniteQuery<
    DoctorApiResponse,
    HTTPError,
    InfiniteData<DoctorApiResponse>,
    unknown[],
    number
  >({
    queryKey: ["api/doctor", searchTerm],
    queryFn: (queryParams) =>
      doctorInfiniteQueryFn({
        searchTerm,
        pageSize,
        pageParam: queryParams.pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}

export function useDoctorAvailableInfiniteQuery(
  searchTerm: string,
  workDate: string,
  slotId: string,
  pageSize: number = 20
) {
  return useInfiniteQuery<
    DoctorApiResponse,
    HTTPError,
    InfiniteData<DoctorApiResponse>,
    unknown[],
    number
  >({
    queryKey: ["api/doctor/available", searchTerm, workDate, slotId],
    queryFn: (queryParams) =>
      doctorAvailableQueryFn({
        searchTerm,
        workDate,
        slotId,
        pageSize,
        pageParam: queryParams.pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
    enabled: !!workDate && !!slotId,
  });
}



