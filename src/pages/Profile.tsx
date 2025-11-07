import { IonContent } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import React from "react";
import { UserCircle, Mail, Phone, Star, CheckCircle2 } from "lucide-react";

export default function Profile() {
  return (
    <IonContent>
      <SafeAreaView>
        <div className="flex flex-col gap-6 bg-gradient-to-b from-sky-50 via-blue-50 to-white px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">Profile</span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white p-5 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserCircle className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold">Alex Kim</div>
              <div className="text-xs text-slate-600">Patient ID: CRY-10293</div>
            </div>
            <div className="inline-flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-400" />
              <span className="text-xs font-medium">Gold</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value="alex.kim@example.com" />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value="(415) 555-0199" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Appointments" value="12" />
            <StatCard label="Success Rate" value="45%" />
            <StatCard label="Member Since" value="2023" />
          </div>

          <div className="rounded-xl border border-blue-100 bg-white p-4">
            <div className="text-sm font-semibold mb-2">Care Preferences</div>
            <div className="flex flex-col gap-2 text-xs text-slate-700">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-500" /> SMS Notifications
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-500" /> Email Summaries
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-500" /> Appointment Reminders
              </div>
            </div>
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 flex items-center justify-between">
      <div className="inline-flex items-center gap-3 text-sm">
        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-slate-600">{label}</span>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center rounded-xl border border-blue-100 bg-white py-3">
      <div className="text-xl font-bold text-blue-600">{value}</div>
      <div className="text-[11px] text-slate-600">{label}</div>
    </div>
  );
}
