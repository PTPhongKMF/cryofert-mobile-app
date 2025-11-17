import {
  TreatmentApiResponseSchema,
  type TreatmentApiResponse,
  TreatmentDetailApiResponseSchema,
  type TreatmentDetailApiResponse,
} from "@src/schemas/treatment";
import { httpClient } from "@src/services/api-services/http-service";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import * as v from "valibot";

export function useTreatementInfiniteQuery(
  patientId: string,
  pageSize: number = 20
) {
  return useInfiniteQuery<
    TreatmentApiResponse,
    HTTPError,
    InfiniteData<TreatmentApiResponse>,
    unknown[],
    number
  >({
    queryKey: ["api/treatment", patientId, pageSize],
    queryFn: async (queryParams) => {
      const res = await httpClient
        .get("api/treatment", {
          searchParams: {
            patientId: patientId,
            page: queryParams.pageParam,
            size: pageSize,
            sort: "createdAt",
            order: "desc",
          },
        })
        .json();

      return v.parse(TreatmentApiResponseSchema, res);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}

export function useTreatmentDetailQuery(treatmentId: string) {
  return useQuery<TreatmentDetailApiResponse, HTTPError>({
    queryKey: ["api/treatment", treatmentId],
    queryFn: async () => {
      const res = await httpClient
        .get(`api/treatment/${treatmentId}`)
        .json();

      return v.parse(TreatmentDetailApiResponseSchema, res);
    },
    enabled: !!treatmentId,
  });
}
