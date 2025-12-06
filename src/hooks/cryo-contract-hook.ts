import type {
  CryoContractListApiResponse,
  CryoContractStatus,
} from "@src/schemas/cryo-contract";
import { cryoContractInfiniteQueryFn } from "@src/services/api-services/cryo-contract-service";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";

export type CryoContractFilterOptions = {
  status?: CryoContractStatus;
  fromDate?: string;
  toDate?: string;
};

export function useCryoContractInfiniteQuery(
  patientId: string,
  pageSize: number = 20,
  filterOptions?: CryoContractFilterOptions
) {
  return useInfiniteQuery<
    CryoContractListApiResponse,
    HTTPError,
    InfiniteData<CryoContractListApiResponse>,
    unknown[],
    number
  >({
    queryKey: [
      "api/cryostoragecontracts",
      patientId,
      pageSize,
      filterOptions?.status,
      filterOptions?.fromDate,
      filterOptions?.toDate,
    ],
    queryFn: ({ pageParam }) =>
      cryoContractInfiniteQueryFn({
        patientId,
        pageSize,
        pageParam,
        status: filterOptions?.status,
        fromDate: filterOptions?.fromDate,
        toDate: filterOptions?.toDate,
      }),
    enabled: !!patientId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}

