import {
  TransactionHistoryApiResponseSchema,
  type TransactionHistoryApiResponse,
} from "@src/schemas/transaction";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function transactionHistoryQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
}): Promise<TransactionHistoryApiResponse> {
  const res = await httpClient
    .get("api/transaction", {
      searchParams: {
        patientId: params.patientId,
        page: params.pageParam,
        size: params.pageSize,
        sort: "transactionDate",
        order: "desc",
      },
    })
    .json();

  return v.parse(TransactionHistoryApiResponseSchema, res);
}
