import type { NotificationHistoryApiResponse } from "@src/schemas/notification";
import { NotificationHistoryApiResponseSchema } from "@src/schemas/notification";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function notificationHistoryQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
  status?: string;
  type?: string;
}): Promise<NotificationHistoryApiResponse> {
  const res = await httpClient
    .get("api/notification", {
      searchParams: {
        patientId: params.patientId,
        status: params.status,
        type: params.type,
        page: params.pageParam,
        size: params.pageSize,
        sort: "createdAt",
        order: "desc",
      },
    })
    .json();

  return v.parse(NotificationHistoryApiResponseSchema, res);
}


