import type {
  NotificationHistoryApiResponse,
  NotificationResponse,
} from "@src/schemas/notification";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { notificationHistoryQueryFn } from "@src/services/api-services/notification-service";

export interface NotificationHistoryFilters {
  status: NotificationResponse["status"] | null;
  type: NotificationResponse["type"] | null;
}

export function useNotificationHistoryInfiniteQuery(
  patientId: string,
  filters?: NotificationHistoryFilters,
  pageSize: number = 20
) {
  return useInfiniteQuery<
    NotificationHistoryApiResponse,
    HTTPError,
    InfiniteData<NotificationHistoryApiResponse>,
    unknown[],
    number
  >({
    queryKey: [
      "api/notification",
      patientId,
      pageSize,
      filters?.status,
      filters?.type,
    ],
    queryFn: (queryParams) =>
      notificationHistoryQueryFn({
        patientId,
        pageSize,
        pageParam: queryParams.pageParam,
        status: filters?.status ?? undefined,
        type: filters?.type ?? undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.metaData?.hasNext ? lastPage.metaData.page + 1 : undefined,
  });
}



