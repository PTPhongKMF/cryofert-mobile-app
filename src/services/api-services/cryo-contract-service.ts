import {
  CryoContractListApiResponseSchema,
  type CryoContractListApiResponse,
  type CryoContractStatus,
} from "@src/schemas/cryo-contract";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function cryoContractInfiniteQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
  status?: CryoContractStatus;
  fromDate?: string;
  toDate?: string;
}): Promise<CryoContractListApiResponse> {
  const res = await httpClient
    .get("api/cryostoragecontracts", {
      searchParams: {
        patientId: params.patientId,
        status: params.status,
        fromDate: params.fromDate,
        toDate: params.toDate,
        page: params.pageParam,
        size: params.pageSize,
      },
    })
    .json();

  return v.parse(CryoContractListApiResponseSchema, res);
}

