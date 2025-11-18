import type { TransactionHistoryApiResponse } from "@src/schemas/transaction";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { transactionHistoryQueryFn } from "@src/services/api-services/transaction-service";

export function useTransactionHistoryInfiniteQuery(
  patientId: string,
  pageSize: number = 20
) {
  return useInfiniteQuery<
    TransactionHistoryApiResponse,
    HTTPError,
    InfiniteData<TransactionHistoryApiResponse>,
    unknown[],
    number
  >({
    queryKey: ["api/transaction", patientId, pageSize],
    queryFn: (queryParams) =>
      transactionHistoryQueryFn({
        patientId,
        pageSize,
        pageParam: queryParams.pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}



