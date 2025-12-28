import { IonList, IonItem, IonLabel } from "@ionic/react";
import type { CryoContractDetailResponse } from "@src/schemas/cryo-contract";
import { safeFormat } from "@src/utils/date";

interface CryoContractDetailSamplesProps {
  samples: CryoContractDetailResponse["samples"];
}

export default function CryoContractDetailSamples({
  samples,
}: CryoContractDetailSamplesProps) {
  if (samples.length === 0) {
    return (
      <div className="px-4 flex flex-col items-center justify-center py-14 text-center text-sm text-gray-600 italic">
        No samples found for this contract.
      </div>
    );
  }

  return (
    <div className="px-4 flex flex-col gap-4">
      <IonList className="bg-transparent!">
        {samples.map((sample) => (
          <IonItem
            key={sample.id}
            lines="full"
            className="bg-gray-50 rounded-xl border border-blue-200 shadow-lg mb-4"
          >
            <div className="w-full flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <IonLabel className="text-base font-semibold text-blue-500!">
                  {sample.sampleCode}
                </IonLabel>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                    sample.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {sample.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Sample Type:</span>
                  <span className="font-normal text-xs text-black">
                    {sample.sampleType}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">Lab Sample ID:</span>
                  <span className="font-normal text-xs text-black">
                    {sample.labSampleId}
                  </span>
                </div>

                {sample.storageDate && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Storage Date:</span>
                    <span className="font-normal text-xs text-black">
                      {safeFormat(
                        new Date(sample.storageDate),
                        "MMM DD, YYYY"
                      )}
                    </span>
                  </div>
                )}

                {sample.storageLocation && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">Storage Location:</span>
                    <span className="font-normal text-xs text-black">
                      {sample.storageLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
}

