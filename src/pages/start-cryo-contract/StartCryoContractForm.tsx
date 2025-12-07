import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonRouter,
  type InfiniteScrollCustomEvent,
} from "@ionic/react";
import CryoIcon from "@assets/images/cryo-fertility.png";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { StartContractForm } from "@src/schemas/cryo-contract";
import { StartContractFormSchema } from "@src/schemas/cryo-contract";
import type { CryoPackageResponse } from "@src/schemas/cryo-package";
import type { LabSampleResponse } from "@src/schemas/lab-sample";
import { useCryoPackageInfiniteQuery } from "@src/hooks/cryo-package-hook";
import { useLabSampleInfiniteQuery } from "@src/hooks/lab-sample-hook";
import { useCreateCryoContractMutation } from "@src/hooks/cryo-contract-hook";
import { useForm, useWatch } from "react-hook-form";
import { useLocalUserStore } from "@src/stores/user";
import { useGenericDialogStore } from "@src/stores/dialog";
import { usePatientHasRequiredInfo } from "@src/hooks/account-hook";
import { cn } from "@utils/cn";
import { useEffect, useRef, useState } from "react";
import PackageDetailModal from "@src/components/start-cryo-contract/PackageDetailModal";
import { alertCircleOutline } from "ionicons/icons";
import { ROUTES } from "@src/routes/routes";

export default function StartCryoContractForm() {
  const [selectedPackage, setSelectedPackage] =
    useState<CryoPackageResponse | null>(null);
  const [viewingPackage, setViewingPackage] =
    useState<CryoPackageResponse | null>(null);
  const [selectedSamples, setSelectedSamples] = useState<LabSampleResponse[]>(
    []
  );

  const packageSheetBtn = useRef<HTMLIonButtonElement>(null);
  const packageSheetModal = useRef<HTMLIonModalElement>(null);
  const sampleSheetBtn = useRef<HTMLIonButtonElement>(null);
  const sampleSheetModal = useRef<HTMLIonModalElement>(null);

  const localUser = useLocalUserStore((s) => s.localUser);

  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const router = useIonRouter();

  const patientRequiredInfoQuery = usePatientHasRequiredInfo(
    localUser?.id ?? "",
    !!localUser?.id
  );

  const startContractForm = useForm<StartContractForm>({
    defaultValues: {
      formSampleType: "Oocyte",
      cryoPackageId: "",
      cryoPackageMaxSamples: 0,
      samples: [],
    },
    reValidateMode: "onSubmit",
    resolver: valibotResolver(StartContractFormSchema),
  });
  const currentSampleType = useWatch({
    control: startContractForm.control,
    name: "formSampleType",
  });

  useEffect(() => {
    if (!patientRequiredInfoQuery.isError) return;

    const missingInfoMessage =
      patientRequiredInfoQuery.error?.message ?? "information";

    openGenericDialog({
      content: `Please provide more information to use our service, missing: ${missingInfoMessage}`,
      svgIcon: alertCircleOutline,
      svgIconColor: "warning",
      backdropDismiss: false,
      buttons: {
        text: "Go to update",
        color: "warning",
        closeFn: () => router.push(ROUTES.UPDATE_ACCOUNT, "forward", "replace"),
      },
    });
  }, [
    openGenericDialog,
    patientRequiredInfoQuery.error?.message,
    patientRequiredInfoQuery.isError,
    router,
  ]);

  const cryoPackageQuery = useCryoPackageInfiniteQuery(currentSampleType);
  const packages =
    cryoPackageQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const labSampleQuery = useLabSampleInfiniteQuery(localUser?.id || "", 20, {
    type: currentSampleType,
    status: "QualityChecked",
    sortType: "LatestCollection",
    isAvailable: true,
    isStoraged: false,
  });
  const labSamples =
    labSampleQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const createCryoContractMutation = useCreateCryoContractMutation();
  const isSubmittingContract = createCryoContractMutation.isPending;

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

  async function handleLoadMoreSample(
    ev: InfiniteScrollCustomEvent
  ): Promise<void> {
    if (!labSampleQuery.hasNextPage) {
      ev.target.complete();
      return;
    }

    await labSampleQuery.fetchNextPage();
    ev.target.complete();
  }

  function handlePackageConfirm() {
    if (!viewingPackage) return;

    setSelectedPackage(viewingPackage);
    startContractForm.setValue("cryoPackageId", viewingPackage.id);
    startContractForm.setValue(
      "cryoPackageMaxSamples",
      viewingPackage.maxSamples
    );

    setViewingPackage(null);
    packageSheetModal.current?.dismiss();
  }

  function toggleSampleSelection(sample: LabSampleResponse) {
    const exists = selectedSamples.some((s) => s.id === sample.id);
    let next: LabSampleResponse[];

    if (exists) {
      next = selectedSamples.filter((s) => s.id !== sample.id);
    } else {
      next = [...selectedSamples, sample];
    }

    setSelectedSamples(next);
    startContractForm.setValue(
      "samples",
      next.map((s) => ({
        labSampleId: s.id,
        sampleType: s.sampleType,
      }))
    );
  }

  function handleClearForm() {
    startContractForm.reset();
    setSelectedPackage(null);
    setViewingPackage(null);
    setSelectedSamples([]);
  }

  function handleStartContract(data: StartContractForm) {
    if (!localUser?.id) {
      openGenericDialog({
        content: "Missing patient information. Please re-login and try again.",
        backdropDismiss: false,
      });
      return;
    }

    createCryoContractMutation.mutate(
      {
        patientId: localUser.id,
        cryoPackageId: data.cryoPackageId,
        samples: data.samples.map((sample) => ({
          labSampleId: sample.labSampleId,
        })),
      },
      {
        onSuccess: (data) => {
          router.push(
            `${ROUTES.START_CONTRACT_PAPER}?contractId=${data.data.id}`,
            "forward",
            "replace"
          );
        },
        onError: (error) => {
          openGenericDialog({
            svgIcon: alertCircleOutline,
            svgIconColor: "danger",
            content: String(error),
          });
        },
      }
    );
  }

  const showBlockingOverlay =
    patientRequiredInfoQuery.isLoading || isSubmittingContract;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Start Cryo Contract Subscription</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-bg-blue-100">
        <div className="relative h-full">
          {showBlockingOverlay && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
              <IonSpinner name="circular" className="text-blue-500 size-8" />
            </div>
          )}

          <div className="flex flex-col justify-center items-center gap-14 px-2 py-4">
            <div className="w-full px-6 flex flex-col items-center text-center gap-3">
              <div className="flex items-center gap-3">
                <IonImg src={CryoIcon} className="size-30" />

                <h2 className="text-lg! font-semibold! uppercase text-blue-600">
                  Preserve your options — safely, simply
                </h2>
              </div>

              <p className="w-full text-sm text-slate-600">
                Freeze sperm, eggs, or embryos with expert handling, secure
                long-term storage, and flexible plans so your future choices
                stay open. Confidential support from collection through
                retrieval.
              </p>
            </div>

            <form
              id="contract-form"
              noValidate
              onSubmit={startContractForm.handleSubmit(handleStartContract)}
              className="grow w-full flex flex-col justify-start items-center px-2 gap-10"
            >
              <div className="w-full grid grid-cols-3 auto-rows-auto gap-2">
                <p className="col-span-3 self-end text-xl font-semibold">
                  I would like to preserve
                </p>

                <label
                  className={cn(
                    "flex-1 py-3 px-4 rounded-md transition-colors flex items-center justify-center",
                    "text-sm font-medium cursor-pointer",
                    currentSampleType === "Oocyte"
                      ? "border-2 border-blue-500 text-blue-600 bg-neutral-50"
                      : "border-2 border-gray-300 text-gray-600 bg-gray-200"
                  )}
                >
                  <input
                    type="radio"
                    checked={currentSampleType === "Oocyte"}
                    onChange={() => {
                      handleClearForm();
                      startContractForm.setValue("formSampleType", "Oocyte");
                    }}
                    className="appearance-none"
                  />
                  Oocyte
                </label>

                <label
                  className={cn(
                    "flex-1 py-3 px-4 rounded-md transition-colors cursor-pointer flex items-center justify-center",
                    "text-sm font-medium",
                    currentSampleType === "Sperm"
                      ? "border-2 text-blue-600 border-blue-500 bg-neutral-50"
                      : "border-2 text-gray-600 border-gray-300 bg-gray-200"
                  )}
                >
                  <input
                    type="radio"
                    checked={currentSampleType === "Sperm"}
                    onChange={() => {
                      handleClearForm();
                      startContractForm.setValue("formSampleType", "Sperm");
                    }}
                    className="appearance-none"
                  />
                  Sperm
                </label>

                <label
                  className={cn(
                    "flex-1 py-3 px-4 rounded-md transition-colors cursor-pointer flex items-center justify-center",
                    "text-sm font-medium",
                    currentSampleType === "Embryo"
                      ? "border-2 text-blue-600 border-blue-500 bg-neutral-50"
                      : "border-2 text-gray-600 border-gray-300 bg-gray-200"
                  )}
                >
                  <input
                    type="radio"
                    checked={currentSampleType === "Embryo"}
                    onChange={() => {
                      handleClearForm();
                      startContractForm.setValue("formSampleType", "Embryo");
                    }}
                    className="appearance-none"
                  />
                  Embryo
                </label>
              </div>

              <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
                <div className="w-full relative">
                  <div
                    onClick={() => packageSheetBtn.current?.click()}
                    className="flex justify-between items-center w-full h-12 bg-neutral-50 py-2 rounded-md px-2"
                  >
                    <label className="">Package</label>

                    <IonButton
                      id="package-sheet"
                      ref={packageSheetBtn}
                      size="small"
                      className="normal-case ion-box-shadow-[0] ion-bg-[#edeef0]! text-gray-900"
                    >
                      {selectedPackage?.packageName || "Select"}
                    </IonButton>
                  </div>
                </div>

                {startContractForm.formState.errors.cryoPackageId?.message && (
                  <p className="text-xs text-red-600 px-1">
                    {startContractForm.formState.errors.cryoPackageId.message.toString()}
                  </p>
                )}

                <div className="w-full flex items-start justify-between px-1">
                  <IonNote>Select a Package.</IonNote>
                  {selectedPackage && (
                    <IonButton
                      size="small"
                      fill="clear"
                      disabled={!selectedPackage}
                      onClick={() => {
                        if (selectedPackage) {
                          setViewingPackage(selectedPackage);
                        }
                      }}
                      className="normal-case"
                    >
                      Details
                    </IonButton>
                  )}
                </div>

                <IonModal
                  trigger="package-sheet"
                  ref={packageSheetModal}
                  initialBreakpoint={0.5}
                  breakpoints={[0, 0.5, 0.75]}
                  expandToScroll={false}
                >
                  <IonContent>
                    <IonList>
                      {(cryoPackageQuery.isPending ||
                        (cryoPackageQuery.isLoading &&
                          packages.length === 0)) && (
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
                              onClick={() => {
                                setViewingPackage(pkg);
                              }}
                              className="ion-bg-neutral-50!"
                            >
                              <div className="flex flex-col gap-2 py-2 w-full">
                                <div className="flex items-center justify-between">
                                  <p className="text-base font-semibold text-gray-900">
                                    {pkg.packageName}
                                  </p>
                                </div>

                                <div className="text-sm text-gray-700 flex flex-col gap-1">
                                  <span>
                                    Duration: {pkg.durationMonths} months
                                  </span>
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

                <div className="w-full h-fit flex flex-col justify-center items-start gap-2 mt-6">
                  <div className="w-full relative">
                    <div
                      onClick={() => sampleSheetBtn.current?.click()}
                      className="flex justify-between items-center w-full h-12 bg-neutral-50 py-2 rounded-md px-2"
                    >
                      <label className="">Samples</label>

                      <IonButton
                        id="sample-sheet"
                        ref={sampleSheetBtn}
                        size="small"
                        className="normal-case ion-box-shadow-[0] ion-bg-[#edeef0]! text-gray-900"
                      >
                        {selectedSamples.length > 0
                          ? `${selectedSamples.length} selected`
                          : "Select"}
                      </IonButton>
                    </div>
                  </div>

                  {startContractForm.formState.errors.samples?.message && (
                    <p className="text-xs text-red-600 px-1">
                      {startContractForm.formState.errors.samples.message.toString()}
                    </p>
                  )}

                  <div className="w-full flex items-start justify-between px-1">
                    <IonNote>Select samples.</IonNote>
                  </div>

                  <IonModal
                    trigger="sample-sheet"
                    ref={sampleSheetModal}
                    initialBreakpoint={0.5}
                    breakpoints={[0, 0.5, 0.75]}
                    expandToScroll={false}
                  >
                    <IonContent>
                      <IonList>
                        {(labSampleQuery.isPending ||
                          (labSampleQuery.isLoading &&
                            labSamples.length === 0)) && (
                          <div className="flex justify-center py-4">
                            <IonSpinner color="primary" />
                          </div>
                        )}

                        {!labSampleQuery.isLoading &&
                          labSampleQuery.isSuccess &&
                          labSamples.length === 0 && (
                            <IonNote className="flex justify-center py-6 text-sm text-gray-500">
                              No samples found.
                            </IonNote>
                          )}

                        {labSamples.length > 0 && (
                          <>
                            {labSamples.map((sample) => {
                              const isSelected = selectedSamples.some(
                                (s) => s.id === sample.id
                              );
                              return (
                                <IonItem
                                  key={sample.id}
                                  button
                                  detail={false}
                                  onClick={() => toggleSampleSelection(sample)}
                                  className={cn(
                                    "border",
                                    isSelected
                                      ? " border-blue-200 ion-bg-blue-100!"
                                      : "border-transparent ion-bg-neutral-50!"
                                  )}
                                >
                                  <div className="flex flex-col gap-2 py-2 w-full">
                                    <div className="flex items-center justify-between">
                                      <p className="text-base font-semibold text-gray-900">
                                        {sample.sampleType}
                                      </p>
                                      {sample.quality && (
                                        <span className="text-xs text-gray-500">
                                          {sample.quality}
                                        </span>
                                      )}
                                    </div>

                                    <div className="text-sm text-gray-700 flex flex-wrap gap-2 items-center">
                                      <span className="text-xs text-gray-500">
                                        ID: {sample.sampleCode}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        Status: {sample.status}
                                      </span>
                                    </div>
                                  </div>
                                </IonItem>
                              );
                            })}

                            <IonInfiniteScroll
                              disabled={!labSampleQuery.hasNextPage}
                              onIonInfinite={handleLoadMoreSample}
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

                  {selectedSamples.length > 0 && (
                    <div className="w-full mt-1 flex justify-end">
                      <div className="grid w-max grid-cols-[auto_auto_auto_auto_auto] gap-y-2 text-sm text-gray-800">
                        {selectedSamples.map((sample) => (
                          <div
                            key={sample.id}
                            className="grid grid-cols-subgrid col-span-5 items-center gap-x-3 px-2 py-1 rounded-md border border-blue-200 bg-blue-50"
                          >
                            <span className="font-semibold whitespace-nowrap">
                              {sample.sampleType}
                            </span>

                            <span className="block size-1 rounded-full bg-gray-500" />

                            <span className="text-gray-600 whitespace-nowrap">
                              {sample.quality || "N/A"}
                            </span>

                            <span className="block size-1 rounded-full bg-gray-500" />

                            <span className="text-gray-600 whitespace-nowrap">
                              {sample.sampleCode}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-px-[0.5rem]">
          <div className="flex justify-between items-center gap-2">
            <IonButton
              onClick={handleClearForm}
              fill="solid"
              color="medium"
              className="w-30"
              disabled={showBlockingOverlay}
            >
              Clear
            </IonButton>
            <IonButton
              type="submit"
              form="contract-form"
              fill="solid"
              className="grow"
              disabled={showBlockingOverlay}
            >
              Continue
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
