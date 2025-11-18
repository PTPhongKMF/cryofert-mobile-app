import { format } from "@formkit/tempo";
import {
  DoctorApiResponseSchema,
  type DoctorApiResponse,
} from "@src/schemas/doctor";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function doctorInfiniteQueryFn(params: {
  searchTerm: string;
  pageSize: number;
  pageParam: number;
}): Promise<DoctorApiResponse> {
  const res = await httpClient
    .get("api/doctor", {
      searchParams: {
        searchTerm: params.searchTerm,
        isActive: true,
        page: params.pageParam,
        size: params.pageSize,
      },
    })
    .json();

  return v.parse(DoctorApiResponseSchema, res);
}

export async function doctorAvailableQueryFn(params: {
  searchTerm: string;
  workDate: string;
  slotId: string;
  pageSize: number;
  pageParam: number;
}): Promise<DoctorApiResponse> {
  const res = await httpClient
    .get("api/doctor/available", {
      searchParams: {
        name: params.searchTerm,
        workDate: format(params.workDate, "YYYY-MM-DD"),
        slotId: params.slotId,
        page: params.pageParam,
        size: params.pageSize,
      },
    })
    .json();

  return v.parse(DoctorApiResponseSchema, res);
}
