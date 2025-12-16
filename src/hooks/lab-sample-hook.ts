import type {
  LabSampleListApiResponse,
  LabSampleSortType,
  LabSampleStatus,
  LabSampleType,
} from "@src/schemas/lab-sample";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { labSampleInfiniteQueryFn } from "@src/services/api-services/lab-sample-service";

type LabSampleFilterOptions = {
  type: LabSampleType | null;
  status: LabSampleStatus | null;
  sortType: LabSampleSortType;
  isAvailable?: boolean;
  isStoraged?: boolean;
  canFrozen?: boolean;
};

export function useLabSampleInfiniteQuery(
  patientId: string,
  pageSize: number = 20,
  filterOptions?: LabSampleFilterOptions  
) {
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
      filterOptions?.type,
      filterOptions?.status,
      filterOptions?.sortType,
      filterOptions?.isAvailable,
      filterOptions?.isStoraged,
      filterOptions?.canFrozen,
    ],
    queryFn: ({ pageParam }) =>
      labSampleInfiniteQueryFn({
        patientId,
        pageSize,
        pageParam,
        type: filterOptions?.type ?? undefined,
        status: filterOptions?.status ?? undefined,
        sortType: filterOptions?.sortType ?? "LatestCollection",
        isAvailable: filterOptions?.isAvailable,
        isStoraged: filterOptions?.isStoraged,
        canFrozen: filterOptions?.canFrozen,
      }),
    enabled: !!patientId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}
