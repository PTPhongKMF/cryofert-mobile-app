import type { LabSampleListApiResponse } from "@src/schemas/lab-sample";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { labSampleInfiniteQueryFn } from "@src/services/api-services/lab-sample-service";
import { useLabSampleFilterStore } from "@src/stores/lab-sample";

export function useLabSampleInfiniteQuery(
  patientId: string,
  pageSize: number = 20
) {
  const filterOptions = useLabSampleFilterStore((s) => s.filterOptions);

  return useInfiniteQuery<
    LabSampleListApiResponse,
    HTTPError,
    InfiniteData<LabSampleListApiResponse>,
    unknown[],
    number
  >({
    queryKey: [
      "api/labsample",
      patientId,
      pageSize,
      filterOptions.type,
      filterOptions.status,
      filterOptions.sortType,
    ],
    queryFn: ({ pageParam }) =>
      labSampleInfiniteQueryFn({
        patientId,
        pageSize,
        pageParam,
        type: filterOptions.type ?? undefined,
        status: filterOptions.status ?? undefined,
        sortType: filterOptions.sortType,
      }),
    enabled: !!patientId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}
