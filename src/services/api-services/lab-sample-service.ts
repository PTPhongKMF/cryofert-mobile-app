import {
  LabSampleListApiResponseSchema,
  type LabSampleListApiResponse,
  type LabSampleSortType,
  type LabSampleStatus,
  type LabSampleType,
} from "@src/schemas/lab-sample";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

function getSortConfig(sortType: LabSampleSortType) {
  switch (sortType) {
    case "ExpirySoon":
      return { sortField: "expiryDate", sortOrder: "asc" as const };
    case "LatestCollection":
    default:
      return { sortField: "collectionDate", sortOrder: "desc" as const };
  }
}

export async function labSampleInfiniteQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
  type?: LabSampleType;
  status?: LabSampleStatus;
  sortType: LabSampleSortType;
}): Promise<LabSampleListApiResponse> {
  const { sortField, sortOrder } = getSortConfig(params.sortType);

  const res = await httpClient
    .get("api/labsample", {
      searchParams: {
        patientId: params.patientId,
        page: params.pageParam,
        size: params.pageSize,
        sort: sortField,
        order: sortOrder,
        ...(params.type && { type: params.type }),
        ...(params.status && { status: params.status }),
      },
    })
    .json();

  return v.parse(LabSampleListApiResponseSchema, res);
}
