import { IonSpinner } from "@ionic/react";

export default function ContentSpinnerOverlay() {
  return (
    <div className="absolute inset-0 z-10 bg-white/70 flex justify-center items-center">
      <IonSpinner name="circular" className="text-blue-500 size-8" />
    </div>
  );
}
