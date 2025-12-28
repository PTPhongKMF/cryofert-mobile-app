
import type { CryoPackageApiResponse } from "@src/schemas/cryo-package";
import type { LabSampleType } from "@src/schemas/lab-sample";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { cryoPackageInfiniteQueryFn } from "@src/services/api-services/cryo-package-service";

export function useCryoPackageInfiniteQuery(
  sampleType: LabSampleType,
  pageSize: number = 20,
  enabled: boolean = true
) {
  return useInfiniteQuery<
    CryoPackageApiResponse,
    HTTPError,
    InfiniteData<CryoPackageApiResponse>,
    unknown[],
    number
  >({
    queryKey: ["api/cryopackage", sampleType],
    queryFn: (queryParams) =>
      cryoPackageInfiniteQueryFn({
        sampleType,
        pageSize,
        pageParam: queryParams.pageParam,
      }),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}
