import { IonHeader, IonIcon, IonToolbar, useIonRouter } from "@ionic/react";
import { ROUTES } from "@src/routes/routes";
import { notificationsOutline } from "ionicons/icons";
import { Dna, HeartPulse, List, Snowflake, UserRoundCog } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

export default function AppTabHeader() {
  const headerRef = useRef<HTMLIonHeaderElement>(null);

  const router = useIonRouter();

  useLayoutEffect(() => {
    if (!headerRef.current) return;

    function updateHeight() {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--app-fixed-header-height",
          `${height}px`
        );
      }
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  function topBarTitle() {
    switch (router.routeInfo.pathname) {
      case ROUTES.T_HOME:
        return (
          <>
            <HeartPulse className="h-7 w-7 text-blue-600" />
            CryoFert
          </>
        );
      case ROUTES.T_TREATMENT:
        return (
          <>
            <List className="h-7 w-7 text-blue-600" />
            Treatment Records
          </>
        );
      case ROUTES.T_SAMPLES:
        return (
          <>
            <Dna className="h-7 w-7 text-blue-600" />
            Samples Reservation
          </>
        );
      case ROUTES.T_ACCOUNT:
        return (
          <>
            <UserRoundCog className="h-7 w-7 text-blue-600" />
            Account Center
          </>
        );
      default:
        return (
          <>
            <HeartPulse className="h-7 w-7 text-blue-600" />
            CryoFert
          </>
        );
    }
  }

  return (
    <IonHeader ref={headerRef} className="shadow-none! fixed!">
      <IonToolbar className="ion-bg-transparent!">
        <div className="size-full flex justify-between items-center px-4">
          <h1 className="text-xl! font-semibold! text-blue-500 p-0! m-0! mb-1! flex justify-start items-center gap-2">
            {topBarTitle()}
          </h1>

          <IonIcon
            icon={notificationsOutline}
            color="primary"
            onClick={() => router.push(ROUTES.NOTIFICATION, "forward")}
            className="size-7"
          ></IonIcon>
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
