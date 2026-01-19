import type { CreateTransactionRequest } from "@src/schemas/transaction";
import {
  TransactionHistoryApiResponseSchema,
  type TransactionHistoryApiResponse,
  TransactionApiResponseSchema,
} from "@src/schemas/transaction";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function transactionHistoryQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
  status?: string;
  relatedEntityType?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<TransactionHistoryApiResponse> {
  const res = await httpClient
    .get("api/transaction", {
      searchParams: {
        patientId: params.patientId,
        status: params.status,
        relatedEntityType: params.relatedEntityType,
        fromDate: params.fromDate,
        toDate: params.toDate,
        page: params.pageParam,
        size: params.pageSize,
        sort: "transactionDate",
        order: "desc",
      },
    })
    .json();

  return v.parse(TransactionHistoryApiResponseSchema, res);
}

export async function createTransactionMutationFn(
  req: CreateTransactionRequest,
) {
  const res = await httpClient
    .post("api/transaction", {
      searchParams: {
        paymentGateway: req.paymentGateway,
        relatedEntityType: req.relatedEntityType,
        relatedEntityId: req.relatedEntityId,
      },
    })
    .json();

  return v.parse(TransactionApiResponseSchema, res);
}
