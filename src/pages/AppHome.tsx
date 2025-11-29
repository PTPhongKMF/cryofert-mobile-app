import { IonContent } from "@ionic/react";
import BlueToGrayGradientBg from "@src/components/backgrounds/BlueToGrayGradientBg";
import SafeAreaView from "@src/components/SafeAreaView";
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
} from "lucide-react";
import { useIonRouter } from "@ionic/react";
import { ROUTES } from "@src/routes/routes";
import AppTabHeader from "@src/components/AppTabHeader";

export default function AppHome() {
  const router = useIonRouter();

  // Mock data - replace with actual data later
  const mockUser = {
    name: "Sarah",
    greeting: "Good morning",
  };

  const mockUpcomingAppointments = [
    {
      id: 1,
      type: "IVF Consultation",
      doctor: "Dr. Emily Chen",
      date: "Mar 15, 2025",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      type: "Follow-up",
      doctor: "Dr. Michael Park",
      date: "Mar 20, 2025",
      time: "2:30 PM",
      status: "pending",
    },
  ];

  const mockStorage = {
    eggs: { count: 12, status: "active" },
    embryos: { count: 5, status: "active" },
    sperm: { count: 8, status: "active" },
  };

  const mockNotifications = [
    {
      id: 1,
      type: "reminder",
      message: "Lab results available for review",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "update",
      message: "Storage renewal payment due in 5 days",
      time: "1 day ago",
      read: false,
    },
  ];

  const mockQuickStats = {
    activeTreatments: 2,
    totalAppointments: 8,
    successRate: "68%",
  };

  return (
    <>
      <AppTabHeader />

      <IonContent className="relative">
        <BlueToGrayGradientBg />

        <SafeAreaView withFixedHeader={true} className="relative">
          <div className="px-4 pb-20 space-y-6">
            {/* Quick Actions */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionCard
                  icon={<Calendar className="h-6 w-6" />}
                  title="Book Treatment"
                  subtitle="Schedule appointment"
                  onClick={() => router.push(ROUTES.BOOK_TREATMENT)}
                  color="bg-blue-500"
                />
                <QuickActionCard
                  icon={<FileText className="h-6 w-6" />}
                  title="View History"
                  subtitle="Past appointments"
                  onClick={() => router.push(ROUTES.T_HISTORY)}
                  color="bg-teal-500"
                />
                <QuickActionCard
                  icon={<CreditCard className="h-6 w-6" />}
                  title="Payments"
                  subtitle="View transactions"
                  onClick={() => router.push(ROUTES.TRANSACTION_HISTORY)}
                  color="bg-purple-500"
                />
                <QuickActionCard
                  icon={<Database className="h-6 w-6" />}
                  title="Storage"
                  subtitle="Cryobank samples"
                  onClick={() => {}}
                  color="bg-indigo-500"
                />
              </div>
            </section>

            {/* Upcoming Appointments */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-800">
                  Upcoming Appointments
                </h2>
                <button
                  onClick={() => router.push(ROUTES.T_HISTORY)}
                  className="text-sm text-blue-600 flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {mockUpcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </section>

            {/* Storage Status */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Storage Status
              </h2>
              <div className="bg-white/80 backdrop-blur rounded-xl border border-blue-200 p-4">
                <div className="grid grid-cols-3 gap-4">
                  <StorageItem
                    icon={<Sparkles className="h-5 w-5" />}
                    label="Eggs"
                    count={mockStorage.eggs.count}
                    status={mockStorage.eggs.status}
                  />
                  <StorageItem
                    icon={<FlaskConical className="h-5 w-5" />}
                    label="Embryos"
                    count={mockStorage.embryos.count}
                    status={mockStorage.embryos.status}
                  />
                  <StorageItem
                    icon={<Activity className="h-5 w-5" />}
                    label="Sperm"
                    count={mockStorage.sperm.count}
                    status={mockStorage.sperm.status}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Next renewal</span>
                    <span className="font-semibold text-blue-600">
                      Apr 15, 2025
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Your Journey
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <StatCard
                  icon={<Activity className="h-5 w-5" />}
                  value={mockQuickStats.activeTreatments}
                  label="Active Treatments"
                  color="text-blue-600"
                />
                <StatCard
                  icon={<Calendar className="h-5 w-5" />}
                  value={mockQuickStats.totalAppointments}
                  label="Total Visits"
                  color="text-teal-600"
                />
                <StatCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  value={mockQuickStats.successRate}
                  label="Success Rate"
                  color="text-green-600"
                />
              </div>
            </section>

            {/* Notifications */}
            {mockNotifications.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Notifications
                  </h2>
                  <button className="text-sm text-blue-600">
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2">
                  {mockNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Help & Support */}
            <section>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">
                      Need Help?
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Our support team is available 24/7 to assist you with any
                      questions about your treatment or storage.
                    </p>
                    <button className="text-sm text-blue-600 font-medium flex items-center gap-1">
                      Contact Support
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </SafeAreaView>
      </IonContent>
    </>
  );
}

// Component: Quick Action Card
function QuickActionCard({
  icon,
  title,
  subtitle,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white/80 backdrop-blur rounded-2xl! border border-blue-200 p-4! text-left hover:shadow-md transition-shadow active:scale-[0.98]"
    >
      <div className={`${color} text-white p-2 rounded-lg w-fit mb-3`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-600">{subtitle}</p>
    </button>
  );
}

// Component: Appointment Card
function AppointmentCard({
  appointment,
}: {
  appointment: {
    id: number;
    type: string;
    doctor: string;
    date: string;
    time: string;
    status: string;
  };
}) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border border-blue-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 text-sm mb-1">
            {appointment.type}
          </h3>
          <p className="text-xs text-slate-600">{appointment.doctor}</p>
        </div>
        {appointment.status === "confirmed" ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Clock className="h-5 w-5 text-amber-500" />
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {appointment.date}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {appointment.time}
        </div>
      </div>
    </div>
  );
}

// Component: Storage Item
function StorageItem({
  icon,
  label,
  count,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  status: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-600 mb-2">
        {icon}
      </div>
      <div className="text-lg font-bold text-slate-800">{count}</div>
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-[10px] text-green-600 mt-1">
        {status === "active" ? "● Active" : "Inactive"}
      </div>
    </div>
  );
}

// Component: Stat Card
function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl border border-blue-200 p-3 text-center">
      <div className={`${color} inline-flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="text-xl font-bold text-slate-800">{value}</div>
      <div className="text-[10px] text-slate-600 mt-1">{label}</div>
    </div>
  );
}

// Component: Notification Card
function NotificationCard({
  notification,
}: {
  notification: {
    id: number;
    type: string;
    message: string;
    time: string;
    read: boolean;
  };
}) {
  return (
    <div
      className={`bg-white/80 backdrop-blur rounded-xl border ${
        notification.read ? "border-blue-100" : "border-blue-300"
      } p-3`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-1.5 rounded-lg ${
            notification.type === "reminder" ? "bg-amber-100" : "bg-blue-100"
          }`}
        >
          {notification.type === "reminder" ? (
            <Bell className="h-4 w-4 text-amber-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-800 mb-1">{notification.message}</p>
          <p className="text-xs text-slate-500">{notification.time}</p>
        </div>
        {!notification.read && (
          <div className="h-2 w-2 bg-blue-500 rounded-full mt-1" />
        )}
      </div>
    </div>
  );
}
