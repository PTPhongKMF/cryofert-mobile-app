import type {
  CryoContractListApiResponse,
  CryoContractStatus,
  CryoContractTemplateApiResponse,
  CryoContractApiResponse,
} from "@src/schemas/cryo-contract";
import {
  createCryoContractMutationFn,
  cryoContractInfiniteQueryFn,
  getContractTemplate,
  type CreateCryoContractRequest,
  requestSignCryoContractMutationFn,
  verifySignCryoContractMutationFn,
} from "@src/services/api-services/cryo-contract-service";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";

export type CryoContractFilterOptions = {
  status?: CryoContractStatus;
  fromDate?: string;
  toDate?: string;
};

export function useCreateCryoContractMutation() {
  return useMutation<
    CryoContractApiResponse,
    HTTPError,
    CreateCryoContractRequest
  >({
    mutationFn: createCryoContractMutationFn,
  });
}

export function useRequestSignCryoContractMutation() {
  return useMutation<void, HTTPError, string>({
    mutationFn: requestSignCryoContractMutationFn,
  });
}

export function useVerifySignCryoContractMutation() {
  return useMutation<
    CryoContractApiResponse,
    HTTPError,
    { id: string; otpCode: string }
  >({
    mutationFn: verifySignCryoContractMutationFn,
  });
}

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

export function useCryoContractTemplateQuery(
  contractId: string,
  enabled: boolean = true
) {
  return useQuery<CryoContractTemplateApiResponse, HTTPError>({
    queryKey: [
      "api/cryostoragecontracts",
      contractId,
      "contract-html",
      enabled,
    ],
    queryFn: () => getContractTemplate(contractId),
    enabled: enabled && !!contractId,
  });
}

