import { IonButton, IonContent } from "@ionic/react";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import SafeAreaView from "@src/components/layout/SafeAreaView";
import {
  HeartPulse,
  Calendar,
  Clock,
  FlaskConical,
  Database,
  Bell,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Activity,
  TrendingUp,
  Shield,
  Sparkles,
  Snowflake,
  Stethoscope,
} from "lucide-react";
import { useIonRouter } from "@ionic/react";
import { ROUTES } from "@src/routes/routes";
import AppTabHeader from "@src/components/layout/AppTabHeader";
import { getGreetingOfDay } from "@src/utils/date";
import { useLocalUserStore } from "@src/stores/user";
import BgPattern from "@assets/images/medical-patterns.webp";
import medicalBg from "@assets/images/medical-bg.jpg";
import { cn } from "@utils/cn";
import UpcommingAppointments from "@src/components/home-tab/UpcommingAppointments";
import FrozenSampleStatus from "@src/components/home-tab/FrozenSampleStatus";

export default function Home() {
  const router = useIonRouter();
  const { localUser } = useLocalUserStore();
  const greeting = getGreetingOfDay();
  const firstName = localUser?.firstName || "User";

  const quickActionsArray = [
    {
      icon: Calendar,
      title: "Book Treatment",
      onClick: () => router.push(ROUTES.BOOK_TREATMENT),
      color: "bg-blue-500",
    },
    {
      icon: Snowflake,
      title: "Start Cryo Reserve",
      onClick: () => router.push(ROUTES.T_TREATMENT),
      color: "bg-sky-500",
    },
    {
      icon: FileText,
      title: "Appointments",
      onClick: () => router.push(ROUTES.T_TREATMENT),
      color: "bg-teal-500",
    },
    {
      icon: Stethoscope,
      title: "Treatments",
      onClick: () =>
        router.push(`${ROUTES.T_TREATMENT}?history-segment=treatment`),
      color: "bg-blue-700",
    },
    {
      icon: Database,
      title: "Sample Storage",
      onClick: () => router.push(ROUTES.T_SAMPLES),
      color: "bg-indigo-500",
    },
    {
      icon: CreditCard,
      title: "Payments",
      onClick: () => router.push(ROUTES.TRANSACTION_HISTORY),
      color: "bg-purple-500",
    },
  ];

  return (
    <IonContent className="relative">
      <BlueToGrayGradientBg />

      <SafeAreaView withFixedHeader={true} className="relative">
        <div className="pb-20">
          {/* Greeting Section */}
          <div
            className="py-2 pt-10 pb-30 bg-cover mask-b-from-70% mask-b-to-100%"
            style={{ backgroundImage: `url(${medicalBg})` }}
          >
            <div className="px-4 bg-neutral-100 mask-r-from-50% mask-r-to-90% text-blue-700">
              <p className="font-semibold">{greeting},</p>
              <p className="font-bold text-xl">{firstName}</p>
            </div>
          </div>

          <div className="flex flex-col gap-12 py-4 relative">
            {/* Quick Actions */}
            <section className="flex flex-col gap-3 px-4 ">
              <p className="font-semibold tracking-wider text-sm text-blue-500">
                Quick Actions
              </p>

              <div className="grid grid-cols-3 gap-y-1 grid-rows-2">
                {quickActionsArray.map((action, i) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={action.onClick}
                      className="grid grid-rows-2 justify-items-center"
                    >
                      <div
                        className={cn(
                          "p-1.5 rounded-full border",
                          action.color
                        )}
                      >
                        <IconComponent className="size-6 text-neutral-50" />
                      </div>

                      <p className="flex items-center gap-1 text-xs font-medium leading-none">
                        {action.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Upcomming */}
            <section className="flex flex-col gap-3 px-4">
              <p className="font-semibold tracking-wider text-sm text-blue-500">
                Upcomming appointments
              </p>

              <UpcommingAppointments />
            </section>

            {/* Frozen Samples */}
            <section className="flex flex-col gap-3 px-4">
              <p className="font-semibold tracking-wider text-sm text-blue-500">
                Frozen samples
              </p>

              <FrozenSampleStatus />
            </section>
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}
