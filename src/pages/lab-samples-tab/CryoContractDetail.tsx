import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonButton,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import { useCryoContractDetailQuery } from "@src/hooks/cryo-contract-hook";
import { useEffect, useState } from "react";
import CryoContractDetailInfo from "@src/components/cryo-contract-detail-segments/CryoContractDetailInfo";
import CryoContractDetailSamples from "@src/components/cryo-contract-detail-segments/CryoContractDetailSamples";
import { reload } from "ionicons/icons";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";

export default function CryoContractDetail() {
  const [segment, setSegment] = useState("info");
  const [isManualRefetching, setIsManualRefetching] = useState(false);

  const { contractId } = useParams<{ contractId: string }>();

  const contractQuery = useCryoContractDetailQuery(contractId ?? "");
  const contract = contractQuery.data?.data;

  const isLoading = contractQuery.isPending;

  useEffect(() => {
    if (contractQuery.isError) console.log(contractQuery.error);
  }, [contractQuery.error, contractQuery.isError]);

  return (
    <IonPage>
      <IonHeader className="shadow-none!">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>
            {contract ? (
              <>
                Contract{" "}
                <span className="text-xs">{contract.contractNumber}</span>
              </>
            ) : (
              "Contract"
            )}
          </IonTitle>
          <IonButtons slot="secondary">
            <IonButton
              onClick={async () => {
                setIsManualRefetching(true);
                try {
                  await contractQuery.refetch();
                } finally {
                  setIsManualRefetching(false);
                }
              }}
              disabled={isLoading || isManualRefetching}
            >
              <IonIcon slot="icon-only" icon={reload} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false}>
        <div className="bg-blue-100 flex flex-col h-full">
          {isLoading ? (
            <ContentSpinnerOverlay />
          ) : contractQuery.isError || !contract ? (
            <div className="flex justify-center items-center py-8 italic text-red-500">
              Error loading contract details.
            </div>
          ) : (
            <div className="relative flex flex-col h-full">
              <IonSegment
                value={segment}
                onIonChange={(e) => {
                  const newSegment = e.detail.value?.toString() ?? "info";
                  setSegment(newSegment);
                }}
                className="bg-neutral-100 shrink-0 shadow-lg"
              >
                <IonSegmentButton value="info">
                  <IonLabel className="normal-case text-base">Info</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="samples">
                  <IonLabel className="normal-case text-base">Samples</IonLabel>
                </IonSegmentButton>
              </IonSegment>

              <div className="py-4 flex-1 min-h-0 overflow-y-auto">
                {segment === "info" ? (
                  <CryoContractDetailInfo contract={contract} />
                ) : segment === "samples" ? (
                  <CryoContractDetailSamples samples={contract.samples} />
                ) : null}
              </div>

              {isManualRefetching && <ContentSpinnerOverlay />}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
