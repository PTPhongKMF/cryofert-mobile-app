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
  IonFooter,
  IonModal,
  IonList,
  IonItem,
  IonNote,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonRouter,
  type InfiniteScrollCustomEvent,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import {
  useCryoContractDetailQuery,
  useRenewContractMutation,
} from "@src/hooks/cryo-contract-hook";
import { useEffect, useMemo, useState } from "react";
import CryoContractDetailInfo from "@src/components/cryo-contract-detail-segments/CryoContractDetailInfo";
import CryoContractDetailSamples from "@src/components/cryo-contract-detail-segments/CryoContractDetailSamples";
import { alertCircleOutline, reload } from "ionicons/icons";
import ContentSpinnerOverlay from "@src/components/layout/ContentSpinnerOverlay";
import { useCryoPackageInfiniteQuery } from "@src/hooks/cryo-package-hook";
import type { LabSampleType } from "@src/schemas/lab-sample";
import type { CryoPackageResponse } from "@src/schemas/cryo-package";
import PackageDetailModal from "@src/components/start-cryo-contract/PackageDetailModal";
import { useGenericDialogStore } from "@src/stores/dialog";
import { ROUTES } from "@src/routes/routes";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useShallow } from "zustand/react/shallow";
import { useMediaQuery } from "@src/hooks/media-hook";
import PdfWebViewer from "@src/components/PdfWebViewer";

const LOADER_KEY = "cryo-contract-renew";

export default function CryoContractDetail() {
  const [segment, setSegment] = useState("info");
  const [isManualRefetching, setIsManualRefetching] = useState(false);
  const [isRenewSheetOpen, setIsRenewSheetOpen] = useState(false);
  const [viewingPackage, setViewingPackage] =
    useState<CryoPackageResponse | null>(null);
  const [isViewDocOpen, setIsViewDocOpen] = useState(false);

  const { contractId } = useParams<{ contractId: string }>();
  const router = useIonRouter();
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);
  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );

  const contractQuery = useCryoContractDetailQuery(contractId ?? "");
  const contract = contractQuery.data?.data;
  const contractSampleType = contract?.samples?.[0]?.sampleType;

  const renewContractMutation = useRenewContractMutation();
  const isRenewing = renewContractMutation.isPending;

  const renewTargetContractId =
    contract?.renewFromContractId || contract?.id || "";
  const canViewDocument =
    contract?.status === "Active" || contract?.status === "Renewed";

  const mediaQuery = useMediaQuery(
    {
      relatedEntityType: "CryoStorageContract",
      relatedEntityId: renewTargetContractId,
    },
    contract?.status === "Active" || contract?.status === "Renewed"
  );
  const latestContractMedia = useMemo(() => {
    const items = mediaQuery.data?.data ?? [];
    if (items.length <= 1) return items[0];

    return items.reduce((latest, cur) => {
      const latestTime = Date.parse(latest.uploadDate ?? "");
      const curTime = Date.parse(cur.uploadDate ?? "");

      if (Number.isNaN(latestTime) && Number.isNaN(curTime)) return latest;
      if (Number.isNaN(latestTime)) return cur;
      if (Number.isNaN(curTime)) return latest;

      return curTime > latestTime ? cur : latest;
    });
  }, [mediaQuery.data?.data]);
  const contractPdfFilePath = latestContractMedia?.filePath;

  const cryoPackageQuery = useCryoPackageInfiniteQuery(
    (contractSampleType ?? "Oocyte") as LabSampleType,
    20,
    isRenewSheetOpen && !!contractSampleType
  );
  const packages =
    cryoPackageQuery.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (contractQuery.isError) console.log(contractQuery.error);
  }, [contractQuery.error, contractQuery.isError]);

  async function handleLoadMorePackage(
    ev: InfiniteScrollCustomEvent
  ): Promise<void> {
    if (!cryoPackageQuery.hasNextPage) {
      ev.target.complete();
      return;
    }

    await cryoPackageQuery.fetchNextPage();
    ev.target.complete();
  }

  function handleRenewClick() {
    if (!contract || contractQuery.isPending || isManualRefetching) return;

    if (!contractSampleType) {
      openGenericDialog({
        svgIcon: alertCircleOutline,
        svgIconColor: "warning",
        content: "Unable to renew: missing sample type from this contract.",
      });
      return;
    }

    setIsRenewSheetOpen(true);
  }

  function handleViewDocumentClick() {
    if (!canViewDocument) return;

    if (mediaQuery.isPending || mediaQuery.isFetching) {
      setIsViewDocOpen(true);
      return;
    }

    if (mediaQuery.isError) {
      openGenericDialog({
        svgIcon: alertCircleOutline,
        svgIconColor: "danger",
        content: "Unable to load contract document. Please try again.",
      });
      return;
    }

    if (!contractPdfFilePath) {
      openGenericDialog({
        svgIcon: alertCircleOutline,
        svgIconColor: "warning",
        content: "No contract document available.",
      });
      return;
    }

    setIsViewDocOpen(true);
  }

  function handleSignContractClick() {
    if (!contract || contractQuery.isPending || isManualRefetching) return;

    if (!renewTargetContractId) {
      openGenericDialog({
        svgIcon: alertCircleOutline,
        svgIconColor: "warning",
        content: "Missing contract id.",
      });
      return;
    }

    router.push(
      `${ROUTES.RENEW_CONTRACT_PAPER}?contractId=${renewTargetContractId}`,
      "forward"
    );
  }

  function handleProceedToPaymentClick() {
    if (!contract || contractQuery.isPending || isManualRefetching) return;

    if (!contract.id) {
      openGenericDialog({
        svgIcon: alertCircleOutline,
        svgIconColor: "warning",
        content: "Missing contract id.",
      });
      return;
    }

    router.push(
      `${ROUTES.PAYMENT_PORTAL}?relatedEntityType=CryoStorageContract&relatedEntityId=${contract.id}`,
      "forward"
    );
  }

  function handlePackageConfirm() {
    if (!contract || !viewingPackage) return;

    startLoading(LOADER_KEY);

    renewContractMutation.mutate(
      {
        contractID: renewTargetContractId,
        patientId: contract.patientId,
        cryoPackageId: viewingPackage.id,
      },
      {
        onError: (error) => {
          openGenericDialog({
            title: error.name,
            content: error.message,
            svgIcon: alertCircleOutline,
            svgIconColor: "danger",
          });
        },
        onSuccess: (data) => {
          setViewingPackage(null);
          setIsRenewSheetOpen(false);
          router.push(
            `${ROUTES.RENEW_CONTRACT_PAPER}?contractId=${data.data.id}`,
            "forward",
            "replace"
          );
        },
        onSettled: () => {
          stopLoading(LOADER_KEY);
        },
      }
    );
  }

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
              disabled={contractQuery.isPending || isManualRefetching}
            >
              <IonIcon slot="icon-only" icon={reload} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false}>
        <div className="bg-blue-100 flex flex-col h-full">
          {contractQuery.isPending ||
          (canViewDocument && mediaQuery.isPending) ? (
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

              {(isManualRefetching || isRenewing) && <ContentSpinnerOverlay />}
            </div>
          )}
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-px-[0.5rem]">
          {(contract?.status === "Active" ||
            contract?.status === "Expired") && (
            <div className="flex justify-between items-center gap-2">
              <IonButton
                fill="solid"
                className="w-fit"
                disabled={
                  contractQuery.isPending || isManualRefetching || isRenewing
                }
                onClick={handleRenewClick}
              >
                Renew
              </IonButton>
              <IonButton
                fill="solid"
                color="secondary"
                className="w-full"
                disabled={
                  contractQuery.isPending ||
                  isManualRefetching ||
                  isRenewing ||
                  !canViewDocument ||
                  mediaQuery.isPending
                }
                onClick={handleViewDocumentClick}
              >
                View document
              </IonButton>
            </div>
          )}

          {contract?.status === "Draft" && (
            <IonButton
              fill="solid"
              className="w-full"
              disabled={
                contractQuery.isPending || isManualRefetching || isRenewing
              }
              onClick={handleSignContractClick}
            >
              Sign Contract
            </IonButton>
          )}

          {contract?.status === "Pending" && (
            <IonButton
              fill="solid"
              className="w-full"
              disabled={
                contractQuery.isPending || isManualRefetching || isRenewing
              }
              onClick={handleProceedToPaymentClick}
            >
              Proceed to payment
            </IonButton>
          )}
        </IonToolbar>
      </IonFooter>

      <IonModal
        isOpen={isRenewSheetOpen}
        onDidDismiss={() => setIsRenewSheetOpen(false)}
        initialBreakpoint={0.5}
        breakpoints={[0, 0.5, 0.75]}
        expandToScroll={false}
      >
        <IonContent>
          <IonList>
            {(cryoPackageQuery.isPending ||
              (cryoPackageQuery.isLoading && packages.length === 0)) && (
              <div className="flex justify-center py-4">
                <IonSpinner color="primary" />
              </div>
            )}

            {!cryoPackageQuery.isLoading &&
              cryoPackageQuery.isSuccess &&
              packages.length === 0 && (
                <IonNote className="flex justify-center py-6 text-sm text-gray-500">
                  No packages found.
                </IonNote>
              )}

            {packages.length > 0 && (
              <>
                {packages.map((pkg) => (
                  <IonItem
                    key={pkg.id}
                    button
                    detail={false}
                    disabled={isRenewing}
                    onClick={() => setViewingPackage(pkg)}
                    className="ion-bg-neutral-50!"
                  >
                    <div className="flex flex-col gap-2 py-2 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-semibold text-gray-900">
                          {pkg.packageName}
                        </p>
                      </div>

                      <div className="text-sm text-gray-700 flex flex-col gap-1">
                        <span>Duration: {pkg.durationMonths} months</span>
                        <span>Max samples: {pkg.maxSamples}</span>
                        <span>Price: {pkg.price}</span>
                      </div>
                    </div>
                  </IonItem>
                ))}

                <IonInfiniteScroll
                  disabled={!cryoPackageQuery.hasNextPage}
                  onIonInfinite={handleLoadMorePackage}
                >
                  <IonInfiniteScrollContent
                    loadingText="Loading more..."
                    className="mt-8"
                  />
                </IonInfiniteScroll>
              </>
            )}
          </IonList>
        </IonContent>
      </IonModal>

      <PackageDetailModal
        pkg={viewingPackage}
        isOpen={!!viewingPackage}
        onClose={() => setViewingPackage(null)}
        onConfirm={handlePackageConfirm}
      />

      <IonModal
        isOpen={isViewDocOpen}
        onDidDismiss={() => setIsViewDocOpen(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => setIsViewDocOpen(false)}>
                Close
              </IonButton>
            </IonButtons>
            <IonTitle>Contract Document</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="relative h-full">
            {mediaQuery.isFetching && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <IonSpinner name="crescent" />
              </div>
            )}
            <PdfWebViewer
              fileUrl={contractPdfFilePath}
              className="w-full h-full min-h-[70vh]"
            />
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
}
