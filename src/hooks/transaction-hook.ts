import type { relatedEntityType } from "@src/schemas/transaction";
import {
  type CreateTransactionRequest,
  type TransactionApiResponse,
  type TransactionHistoryApiResponse,
  type TransactionStatus,
} from "@src/schemas/transaction";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import {
  createTransactionMutationFn,
  transactionHistoryQueryFn,
} from "@src/services/api-services/transaction-service";

export interface TransactionHistoryFilters {
  status: TransactionStatus | null;
  relatedEntityType: relatedEntityType | null;
  fromDate: string | null;
  toDate: string | null;
}

export function useTransactionHistoryInfiniteQuery(
  patientId: string,
  filters?: TransactionHistoryFilters,
  pageSize: number = 20
) {
  return useInfiniteQuery<
    TransactionHistoryApiResponse,
    HTTPError,
    InfiniteData<TransactionHistoryApiResponse>,
    unknown[],
    number
  >({
    queryKey: [
      "api/transaction",
      patientId,
      pageSize,
      filters?.status,
      filters?.relatedEntityType,
      filters?.fromDate,
      filters?.toDate,
    ],
    queryFn: (queryParams) =>
      transactionHistoryQueryFn({
        patientId,
        pageSize,
        pageParam: queryParams.pageParam,
        status: filters?.status ?? undefined,
        relatedEntityType: filters?.relatedEntityType ?? undefined,
        fromDate: filters?.fromDate ?? undefined,
        toDate: filters?.toDate ?? undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}

export function useCreateTransactionMutation() {
  return useMutation<
    TransactionApiResponse,
    HTTPError,
    CreateTransactionRequest
  >({
    mutationFn: createTransactionMutationFn,
    onSuccess: (data) => console.log(data),
    onError: (e) => console.log(e),
  });
}
