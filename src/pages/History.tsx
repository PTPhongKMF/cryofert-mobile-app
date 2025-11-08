import { IonContent } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import React from "react";
import { Calendar, Clock, FileCheck } from "lucide-react";

export default function History() {
  return (
    <IonContent>
      <SafeAreaView>
        <div className="flex flex-col gap-6 bg-gradient-to-b from-sky-50 via-blue-50 to-white px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">History</span>
            </div>
          </div>

          <SectionTitle title="Recent Activity" subtitle="Your latest appointments and updates" />

          <div className="grid grid-cols-1 gap-3">
            <HistoryItem
              title="IVF Consultation"
              date="Oct 12, 2025"
              time="10:30 AM"
              status="Completed"
            />
            <HistoryItem
              title="Lab Results Review"
              date="Sep 28, 2025"
              time="02:15 PM"
              status="Completed"
            />
            <HistoryItem
              title="Ultrasound Check"
              date="Sep 02, 2025"
              time="09:00 AM"
              status="Completed"
            />
          </div>

          <SectionTitle title="Documents" />
          <div className="grid grid-cols-1 gap-3">
            <DocItem name="Treatment Summary - Q3" date="Oct 15, 2025" />
            <DocItem name="Lab Report - Hormone Panel" date="Sep 29, 2025" />
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-1">{title}</h2>
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

function HistoryItem({
  title,
  date,
  time,
  status,
}: {
  title: string;
  date: string;
  time: string;
  status: string;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
        <Calendar className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-slate-600 flex items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4 text-blue-500" /> {date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" /> {time}
          </span>
        </div>
      </div>
      <span className="text-[11px] rounded-full bg-teal-50 text-teal-700 px-2 py-1 shrink-0">
        {status}
      </span>
    </div>
  );
}

function DocItem({ name, date }: { name: string; date: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 flex items-center justify-between">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-slate-600">Updated {date}</div>
      </div>
      <button className="inline-flex items-center justify-center rounded-lg border border-blue-200 text-blue-700 px-3 py-1.5 text-xs font-medium active:scale-[0.99]">
        View
      </button>
    </div>
  );
}
