import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useRequestSignAgreementMutation } from "@src/hooks/agreement-hook";
import { useMediaQuery, usePdfPaperQuery } from "@src/hooks/media-hook";
import type { AgreementResponse } from "@src/schemas/agreement";
import type { TreatmentDetail } from "@src/schemas/treatment";
import { useGenericDialogStore } from "@src/stores/dialog";
import { alertCircleOutline, chevronBack } from "ionicons/icons";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import AgreementOtpDialog from "./AgreementOtpDialog";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";
import PdfWebViewer from "@src/components/PdfWebViewer";

interface AgreementDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  agreement: AgreementResponse | null;
  treatment: TreatmentDetail | null;
  onAgreementSigned?: () => void;
}

export default function AgreementPaperDialog(props: AgreementDialogProps) {
  const [isAgree, setIsAgree] = useState(false);
  const [otpIsOpen, setOtpIsOpen] = useState(false);

  const agreementId = props.agreement?.id ?? "";
  const isViewMode =
    props.agreement?.status === "Canceled" ||
    props.agreement?.status === "Completed";

  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);
  const requestSignAgreementMutation = useRequestSignAgreementMutation();

  const agreementPreviewPdfQuery = usePdfPaperQuery({
    relatedEntityType: "Agreement",
    relatedEntityId: agreementId,
    enabled: props.isOpen && !!agreementId && !isViewMode,
  });

  const viewAgreementMediaQuery = useMediaQuery(
    { relatedEntityId: agreementId, relatedEntityType: "Agreement" },
    props.isOpen && !!agreementId && isViewMode
  );

  useEffect(() => {
    if (!props.isOpen) {
      setIsAgree(false);
      setOtpIsOpen(false);
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (agreementPreviewPdfQuery.isError) {
      console.log(agreementPreviewPdfQuery.error);
    }
    if (viewAgreementMediaQuery.isError) {
      console.log(viewAgreementMediaQuery.error);
    }
  }, [
    agreementPreviewPdfQuery.error,
    agreementPreviewPdfQuery.isError,
    viewAgreementMediaQuery.error,
    viewAgreementMediaQuery.isError,
  ]);

  const latestAgreementMedia = useMemo(() => {
    const list = viewAgreementMediaQuery.data?.data;
    if (!list?.length) return null;

    return [...list].sort((a, b) => {
      const aDate = new Date(a.uploadDate).getTime();
      const bDate = new Date(b.uploadDate).getTime();
      return bDate - aDate;
    })[0];
  }, [viewAgreementMediaQuery.data?.data]);

  const isPdfMedia =
    latestAgreementMedia?.fileExtension?.toLowerCase() === ".pdf";

  const viewModeMissingPdf =
    isViewMode &&
    viewAgreementMediaQuery.isSuccess &&
    (!latestAgreementMedia || !isPdfMedia);

  const isLoading = isViewMode
    ? viewAgreementMediaQuery.isLoading
    : agreementPreviewPdfQuery.isLoading || requestSignAgreementMutation.isPending;

  const shouldShowError =
    !agreementId ||
    (!isViewMode && agreementPreviewPdfQuery.isError) ||
    (isViewMode && (viewAgreementMediaQuery.isError || viewModeMissingPdf));

  const pdfUrl = isViewMode
    ? isPdfMedia
      ? latestAgreementMedia?.filePath
      : undefined
    : agreementPreviewPdfQuery.data?.objectUrl;

  function handleClose() {
    props.setIsOpen(false);
  }

  function handleContinue() {
    requestSignAgreementMutation.mutate(agreementId, {
      onError: (error) => {
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIconColor: "danger",
          svgIcon: alertCircleOutline,
        });
      },
      onSuccess: () => {
        setOtpIsOpen(true);
      },
    });
  }

  return (
    <>
      <IonModal isOpen={props.isOpen} onDidDismiss={handleClose}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleClose}>
                <IonIcon icon={chevronBack} slot="icon-only" />
              </IonButton>
            </IonButtons>
            <IonTitle className="ms-4">Agreement</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          {shouldShowError ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-4 py-8 bg-slate-100">
              <IonIcon
                icon={alertCircleOutline}
                className="text-3xl text-red-600"
              />
              <p className="text-lg font-semibold text-red-600">
                Unable to load agreement
              </p>
              <p className="text-sm text-gray-600">
                {agreementId
                  ? viewModeMissingPdf
                    ? "Latest agreement file is not a PDF."
                    : "Something went wrong. Please try again."
                  : "Missing agreement id."}
              </p>
              <IonButton onClick={handleClose} color="medium" className="w-32">
                Close
              </IonButton>
            </div>
          ) : (
            <div className="relative h-full">
              {isLoading && <ContentSpinnerOverlay />}
              <PdfWebViewer
                fileUrl={pdfUrl}
                className="w-full h-full min-h-[70vh]"
              />
            </div>
          )}
        </IonContent>

        {!isViewMode && !shouldShowError && (
          <IonFooter>
            <IonToolbar className="ion-px-[0.5rem] ion-py-[0.5rem]">
              <IonCheckbox
                labelPlacement="end"
                disabled={isLoading}
                checked={isAgree}
                onIonChange={(ev) => setIsAgree(ev.detail.checked)}
                className="mb-2"
              >
                I certify my information and accept the agreement.
              </IonCheckbox>
              <IonButton
                onClick={handleContinue}
                fill="solid"
                className="w-full"
                disabled={isLoading || !isAgree}
              >
                Sign agreement
              </IonButton>
            </IonToolbar>
          </IonFooter>
        )}
      </IonModal>

      <AgreementOtpDialog
        isOpen={otpIsOpen}
        setIsOpen={setOtpIsOpen}
        agreementId={agreementId}
        onAgreementSigned={() => {
          setIsAgree(false);
          props.setIsOpen(false);
          props.onAgreementSigned?.();
        }}
      />
    </>
  );
}
