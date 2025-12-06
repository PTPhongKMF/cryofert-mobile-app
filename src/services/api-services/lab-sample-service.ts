import {
  LabSampleListApiResponseSchema,
  type LabSampleListApiResponse,
  type LabSampleSortType,
  type LabSampleStatus,
  type LabSampleType,
} from "@src/schemas/lab-sample";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function labSampleInfiniteQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
  type?: LabSampleType;
  status?: LabSampleStatus;
  sortType: LabSampleSortType;
  isAvailable?: boolean;
  isStoraged?: boolean;
}): Promise<LabSampleListApiResponse> {
  const isExpirySort = params.sortType === "ExpirySoon";
  const sortField = isExpirySort ? "expiryDate" : "collectionDate";
  const sortOrder = isExpirySort ? "asc" : "desc";

  const res = await httpClient
    .get("api/labsample", {
      searchParams: {
        patientId: params.patientId,
        isAvailable: params.isAvailable,
        isStoraged: params.isStoraged,
        page: params.pageParam,
        size: params.pageSize,
        sort: sortField,
        order: sortOrder,
        ...(params.type && { sampleType: params.type }),
        ...(params.status && { status: params.status }),
      },
    })
    .json();

  return v.parse(LabSampleListApiResponseSchema, res);
}
