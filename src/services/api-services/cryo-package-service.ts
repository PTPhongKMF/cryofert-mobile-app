import {
  CryoPackageApiResponseSchema,
  type CryoPackageApiResponse,
} from "@src/schemas/cryo-package";
import type { LabSampleType } from "@src/schemas/lab-sample";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function cryoPackageInfiniteQueryFn(params: {
  sampleType: LabSampleType;
  pageSize: number;
  pageParam: number;
}): Promise<CryoPackageApiResponse> {
  const res = await httpClient
    .get("api/cryopackage", {
      searchParams: {
        sampleType: params.sampleType,
        isActive: true,
        page: params.pageParam,
        size: params.pageSize,
      },
    })
    .json();

  return v.parse(CryoPackageApiResponseSchema, res);
}
