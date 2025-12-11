import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonCheckbox,
  useIonRouter,
  IonSpinner,
} from "@ionic/react";
import { useState } from "react";
import { useLocation } from "react-router";
import { useRequestSignCryoContractMutation } from "@src/hooks/cryo-contract-hook";
import { useGenericDialogStore } from "@src/stores/dialog";
import ContractOtpDialog from "@src/components/start-cryo-contract/ContractOtpDialog";
import { useHtmlPaperQuery } from "@src/hooks/media-hook";

export default function StartCryoContractPaper() {
  const [isAgree, setIsAgree] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const location = useLocation();
  const router = useIonRouter();
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const searchParams = new URLSearchParams(location.search);
  const contractId = searchParams.get("contractId") ?? "";
  const hasContractId = !!contractId;

  const contractTemplateQuery = useHtmlPaperQuery({
    relatedEntityType: "CryoStorageContract",
    relatedEntityId: contractId,
    enabled: hasContractId,
  });

  const requestSignCryoContractMutation = useRequestSignCryoContractMutation();

  const isLoading =
    contractTemplateQuery.isLoading ||
    contractTemplateQuery.isFetching ||
    requestSignCryoContractMutation.isPending;
  const shouldShowError = !hasContractId || contractTemplateQuery.isError;
  const contractHtml = contractTemplateQuery.data?.data.html ?? "";

  function handleCancel() {
    openGenericDialog({
      content: "Are you sure you want to cancel the contract?",
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
            <IonTitle>Cryo Contract</IonTitle>
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
          <IonTitle>Cryo Contract</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="relative h-full">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <IonSpinner name="crescent" />
            </div>
          )}

          {contractTemplateQuery.isSuccess && (
            <iframe
              title="Cryo contract"
              srcDoc={contractHtml}
              className="w-full h-full min-h-[70vh] border-0"
            />
          )}
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-px-[0.5rem] ion-py-[0.5rem]">
          <IonCheckbox
            labelPlacement="end"
            disabled={isLoading}
            checked={isAgree}
            onIonChange={(ev) => setIsAgree(ev.detail.checked)}
            className="mb-2"
          >
            I certify my information and accept the contract.
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

      <ContractOtpDialog
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
