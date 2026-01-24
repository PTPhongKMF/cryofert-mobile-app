import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { useLocation } from "react-router";

import RenewContractOtpDialog from "@src/components/lab-sample-tab/RenewContractOtpDialog";
import PdfWebViewer from "@src/components/PdfWebViewer";
import { useRequestSignCryoContractMutation } from "@src/hooks/cryo-contract-hook";
import { usePdfPaperQuery } from "@src/hooks/media-hook";
import { useGenericDialogStore } from "@src/stores/dialog";

export default function RenewCryoContractPaper() {
  const [isAgree, setIsAgree] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const location = useLocation();
  const router = useIonRouter();
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const contractId =
    new URLSearchParams(location.search).get("contractId") ?? "";
  const hasContractId = !!contractId;

  const contractPdfQuery = usePdfPaperQuery({
    relatedEntityType: "CryoStorageContract",
    relatedEntityId: contractId,
    enabled: hasContractId,
  });

  const requestSignCryoContractMutation = useRequestSignCryoContractMutation();

  const isLoading =
    contractPdfQuery.isLoading ||
    contractPdfQuery.isFetching ||
    requestSignCryoContractMutation.isPending;
  const shouldShowError = !hasContractId || contractPdfQuery.isError;

  function handleCancel() {
    openGenericDialog({
      content: "Are you sure you want to cancel renewing the contract?",
      buttons: [
        {
          text: "Stay",
          color: "medium",
        },
        {
          text: "Yes, cancel",
          color: "danger",
          closeFn: () => router.goBack(),
        },
      ],
    });
  }

  function handleContinue() {
    requestSignCryoContractMutation.mutate(contractId, {
      onError: (error) => {
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIconColor: "danger",
        });
      },
      onSuccess: () => {
        setIsOtpOpen(true);
      },
    });
  }

  if (shouldShowError) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
            <IonTitle>Renew Contract</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-lg font-semibold text-red-600">
              Unable to load contract
            </p>
            <p className="text-sm text-gray-600">
              {hasContractId
                ? "Something went wrong. Please try again."
                : "Missing contractId in the link."}
            </p>
            <IonButton
              onClick={() => router.goBack()}
              color="medium"
              className="w-32"
            >
              Go Back
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Renew Contract</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="relative h-full">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <IonSpinner name="crescent" />
            </div>
          )}

          <PdfWebViewer
            fileUrl={contractPdfQuery.data?.objectUrl}
            className="w-full h-full min-h-[70vh]"
          />
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-px-[0.5rem] ion-py-[0.5rem]">
          <IonCheckbox
            labelPlacement="end"
            disabled={isLoading}
            checked={isAgree}
            onIonChange={(ev) => setIsAgree(ev.detail.checked)}
            className="mb-2 text-xs!"
          >
            I certify my information and accept the renewed contract.
          </IonCheckbox>
          <div className="flex justify-between items-center gap-2">
            <IonButton
              onClick={handleCancel}
              fill="solid"
              color="danger"
              className="w-30"
              disabled={isLoading || isAgree}
            >
              Cancel
            </IonButton>
            <IonButton
              onClick={handleContinue}
              fill="solid"
              className="w-full"
              disabled={isLoading || !isAgree}
            >
              Continue
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>

      <RenewContractOtpDialog
        isOpen={isOtpOpen}
        setIsOpen={setIsOtpOpen}
        contractId={contractId}
        onContractSigned={() => {
          setIsAgree(false);
        }}
      />
    </IonPage>
  );
}
