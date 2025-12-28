import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import GreenToGrayGradientBg from "@src/components/backgrounds/GreenToGrayGradientBg";
import type { NotificationHistoryApiResponse } from "@src/schemas/notification";
import { useLocalUserStore } from "@src/stores/user";
import { format } from "@formkit/tempo";
import {
  useNotificationHistoryInfiniteQuery,
  type NotificationHistoryFilters,
} from "@src/hooks/notification-hook";
import NotificationHistoryFilter from "@src/components/account-center-tab/NotificationHistoryFilter";
import { useEffect, useState } from "react";
import { filter } from "ionicons/icons";
import { cn } from "@src/utils/cn";

export default function Notification() {
  const localUser = useLocalUserStore((s) => s.localUser);

  const [filterOptions, setFilterOptions] = useState<NotificationHistoryFilters>(
    {
      status: null,
      type: null,
    }
  );

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const notificationQuery = useNotificationHistoryInfiniteQuery(
    localUser?.id || "",
    filterOptions
  );

  useEffect(() => {
    if (notificationQuery.isError) console.log(notificationQuery.error);
  }, [notificationQuery.error, notificationQuery.isError]);

  const notifications =
    notificationQuery.data?.pages.flatMap(
      (page: NotificationHistoryApiResponse) => page.data
    ) ?? [];

  async function handleLoadMore(e: CustomEvent<void>) {
    await notificationQuery.fetchNextPage();
    (e.target as HTMLIonInfiniteScrollElement)?.complete();
  }

  async function handleRefresh(e: CustomEvent) {
    await notificationQuery.refetch();
    e.detail.complete();
  }

  function getNotificationItemClasses(
    isImportant: boolean,
    readTime: string | null
  ): string {
    const isRead = readTime !== null;
    const baseClasses =
      "ion-bg-transparent bg-white/90 rounded-xl mb-2 transition-all";
    
    if (isImportant) {
      // Important items: orange border, brighter if unread, dimmer if read
      if (isRead) {
        return cn(baseClasses, "border-2 border-orange-300 opacity-60");
      } else {
        return cn(baseClasses, "border-2 border-orange-500 opacity-100");
      }
    } else {
      // Normal items: gray border, dimmer if read, brighter if unread
      if (isRead) {
        return cn(baseClasses, "border border-gray-200 opacity-60");
      } else {
        return cn(baseClasses, "border border-gray-200 opacity-100");
      }
    }
  }

  function getTitleClasses(isImportant: boolean, readTime: string | null): string {
    const baseClasses = "text-gray-900";
    const importantClasses = isImportant ? "font-bold" : "font-semibold";

    return cn(baseClasses, importantClasses);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Notifications</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={() => setIsFilterVisible((prev) => !prev)}>
              <IonIcon slot="icon-only" icon={filter} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false} className="relative">
        <GreenToGrayGradientBg />

        <div className="relative flex flex-col h-full">
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isFilterVisible
                ? "max-h-96 opacity-100 animate-fade-in animate-slide-down"
                : "max-h-0 opacity-0"
            )}
          >
            <div className={cn(!isFilterVisible && "invisible")}>
              <NotificationHistoryFilter
                filters={filterOptions}
                onChange={(update) =>
                  setFilterOptions((prev) => ({ ...prev, ...update }))
                }
              />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <div className="h-full overflow-y-auto px-2 ion-content-scroll-host relative">
              <IonRefresher
                slot="fixed"
                onIonRefresh={handleRefresh}
                className="z-10!"
              >
                <IonRefresherContent />
              </IonRefresher>

              {notificationQuery.isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <IonList className="bg-transparent! pb-0!">
                  {!notificationQuery.isLoading &&
                  notificationQuery.isSuccess &&
                  notifications.length === 0 ? (
                    <div className="flex justify-center items-center h-full italic text-gray-500">
                      No notifications found.
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <IonItem
                          button
                          detail
                          key={notification.id}
                          lines="none"
                          className={getNotificationItemClasses(
                            notification.isImportant,
                            notification.readTime
                          )}
                        >
                          <div className="flex flex-col gap-2 w-full py-2">
                            <div className="flex items-center justify-between">
                              <div
                                className={getTitleClasses(
                                  notification.isImportant,
                                  notification.readTime
                                )}
                              >
                                {notification.title}
                              </div>
                              <div className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-100">
                                {notification.status}
                              </div>
                            </div>

                            <div className="text-sm text-gray-700">
                              {notification.content}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <span>{notification.type}</span>
                                {notification.channel && (
                                  <>
                                    <span aria-hidden>&middot;</span>
                                    <span>{notification.channel}</span>
                                  </>
                                )}
                              </div>
                              <span>
                                {format(
                                  notification.createdAt,
                                  "YYYY-MM-DD HH:mm"
                                )}
                              </span>
                            </div>

                            {notification.notes && (
                              <IonNote className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {notification.notes}
                              </IonNote>
                            )}
                          </div>
                        </IonItem>
                      ))}

                      <IonInfiniteScroll
                        disabled={!notificationQuery.hasNextPage}
                        onIonInfinite={handleLoadMore}
                      >
                        <IonInfiniteScrollContent
                          loadingText="Loading more..."
                          className="mt-8"
                        />
                      </IonInfiniteScroll>
                    </>
                  )}
                </IonList>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
