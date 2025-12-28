import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import type { CryoPackageResponse } from "@src/schemas/cryo-package";
import { formatCurrency } from "@src/utils/currency";
import { close } from "ionicons/icons";

type PackageDetailModalProps = {
  pkg: CryoPackageResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function PackageDetailModal({
  pkg,
  isOpen,
  onClose,
  onConfirm,
}: PackageDetailModalProps) {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>

          <IonTitle className="ms-4">Package Details</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={onConfirm}>Confirm</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-bg-neutral-200">
        {pkg ? (
          <div className="flex flex-col gap-4 text-sm">
            <div className="rounded-lg border border-neutral-200 bg-white shadow-sm p-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold text-gray-900">
                    {pkg.packageName}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {pkg.sampleType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(pkg.price, { locale: "vi-VN", currency: "VND" })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {pkg.durationMonths} months
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-neutral-200 bg-white p-3">
                <p className="text-xs text-gray-500">Max samples</p>
                <p className="text-sm font-medium text-gray-900">
                  {pkg.maxSamples}
                </p>
              </div>
              <div className="rounded-md border border-neutral-200 bg-white p-3">
                <p className="text-xs text-gray-500">Sample type</p>
                <p className="text-sm font-medium text-gray-900">
                  {pkg.sampleType}
                </p>
              </div>
              <div className="rounded-md border border-neutral-200 bg-white p-3">
                <p className="text-xs text-gray-500">Insurance</p>
                <p className="text-sm font-medium text-gray-900">
                  {pkg.includesInsurance ? "Included" : "Not included"}
                </p>
              </div>
              {pkg.includesInsurance && (
                <div className="rounded-md border border-neutral-200 bg-white p-3">
                  <p className="text-xs text-gray-500">Insurance amount</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(pkg.insuranceAmount ?? 0, {
                      locale: "vi-VN",
                      currency: "VND",
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-md border border-neutral-200 bg-white p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-500">Benefits</p>
              <p className="text-sm text-gray-800">{pkg.benefits}</p>
            </div>

            <div className="rounded-md border border-neutral-200 bg-white p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-500">Notes</p>
              <p className="text-sm text-gray-800">
                {pkg.notes || "No additional notes"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No package selected.</p>
        )}
      </IonContent>
    </IonModal>
  );
}
