import {
  TreatmentApiResponseSchema,
  type TreatmentApiResponse,
  TreatmentDetailApiResponseSchema,
  type TreatmentDetailApiResponse,
} from "@src/schemas/treatment";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function treatmentInfiniteQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
}): Promise<TreatmentApiResponse> {
  const res = await httpClient
    .get("api/treatment", {
      searchParams: {
        patientId: params.patientId,
        page: params.pageParam,
        size: params.pageSize,
        sort: "createdAt",
        order: "desc",
      },
    })
    .json();

  return v.parse(TreatmentApiResponseSchema, res);
}

export async function treatmentDetailQueryFn(params: {
  treatmentId: string;
}): Promise<TreatmentDetailApiResponse> {
  const res = await httpClient
    .get(`api/treatment/${params.treatmentId}`)
    .json();

  return v.parse(TreatmentDetailApiResponseSchema, res);
}
