import type {
  TreatmentApiResponse,
  TreatmentDetailApiResponse,
} from "@src/schemas/treatment";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import {
  treatmentDetailQueryFn,
  treatmentInfiniteQueryFn,
} from "@src/services/api-services/treatment-service";

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
    queryFn: (queryParams) =>
      treatmentInfiniteQueryFn({
        patientId,
        pageSize,
        pageParam: queryParams.pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}

export function useTreatmentDetailQuery(treatmentId: string) {
  return useQuery<TreatmentDetailApiResponse, HTTPError>({
    queryKey: ["api/treatment", treatmentId],
    queryFn: () => treatmentDetailQueryFn({ treatmentId }),
    enabled: !!treatmentId,
  });
}



