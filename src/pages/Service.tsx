import { IonContent } from "@ionic/react";
import SafeAreaView from "@src/components/SafeAreaView";
import React from "react";
import { HeartPulse } from "lucide-react";

export default function Service() {
  return (
    <IonContent>
      <SafeAreaView>
        <div className="flex flex-col gap-6 bg-gradient-to-b from-sky-50 via-blue-50 to-white px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">Services</span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white p-4">
            <h2 className="text-lg font-semibold mb-1">Start Your Journey</h2>
            <p className="text-xs text-slate-600">
              Personalized fertility care backed by advanced lab technology and a compassionate team.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-1">
            <BigButton label="IVF" />
            <BigButton label="IUI" />
          </div>
        </div>
      </SafeAreaView>
    </IonContent>
  );
}

function BigButton({ label }: { label: string }) {
  return (
    <button className="w-full aspect-square rounded-xl bg-blue-600 text-white text-2xl font-bold shadow-sm active:scale-[0.99] flex items-center justify-center">
      {label}
    </button>
  );
}
