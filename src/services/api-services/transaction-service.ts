import {
  TransactionHistoryApiResponseSchema,
  type TransactionHistoryApiResponse,
} from "@src/schemas/transaction";
import { httpClient } from "@src/services/api-services/http-service";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import * as v from "valibot";

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
    queryFn: async (queryParams) => {
      const res = await httpClient
        .get("api/transaction", {
          searchParams: {
            patientId: patientId,
            page: queryParams.pageParam,
            size: pageSize,
            sort: "transactionDate",
            order: "desc",
          },
        })
        .json();

      return v.parse(TransactionHistoryApiResponseSchema, res);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}
