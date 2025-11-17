import { format } from "@formkit/tempo";
import {
  DoctorApiResponseSchema,
  type DoctorApiResponse,
} from "@src/schemas/doctor";
import { httpClient } from "@src/services/api-services/http-service";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import * as v from "valibot";

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
    queryFn: async (queryParams) => {
      const res = await httpClient
        .get("api/doctor", {
          searchParams: {
            searchTerm: searchTerm,
            isActive: true,
            page: queryParams.pageParam,
            size: pageSize,
          },
        })
        .json();

      return v.parse(DoctorApiResponseSchema, res);
    },

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
    queryFn: async (queryParams) => {
      console.log({
        name: searchTerm,
        workDate: format(workDate, "YYYY-MM-DD"),
        slotId: slotId,
        page: queryParams.pageParam,
        size: pageSize,
      });

      const res = await httpClient
        .get("api/doctor/available", {
          searchParams: {
            name: searchTerm,
            workDate: format(workDate, "YYYY-MM-DD"),
            slotId: slotId,
            page: queryParams.pageParam,
            size: pageSize,
          },
        })
        .json();

      console.log(res);

      return v.parse(DoctorApiResponseSchema, res);
    },

    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,

    enabled: workDate && slotId ? true : false,
  });
}
