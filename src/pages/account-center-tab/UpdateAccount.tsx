import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonModal,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { MapPin, ShieldCheck, Stethoscope, Phone } from "lucide-react";
import {
  UpdatePatientRequestSchema,
  type UpdatePatientRequest,
} from "@src/schemas/account";
import {
  usePatientDetailQuery,
  useUpdateFullAccountInfoMutation,
} from "@src/hooks/account-hook";
import { useLocalUserStore } from "@src/stores/user";
import { useGenericDialogStore } from "@src/stores/dialog";
import { cn } from "@src/utils/cn";

function stripVietnamPrefix(value: string | null | undefined) {
  const normalized = (value ?? "").trim();

  if (normalized.startsWith("+84")) return normalized.slice(3);
  if (normalized.startsWith("84")) return normalized.slice(2);
  if (normalized.startsWith("+")) return normalized.slice(1);

  return normalized;
}

const defaultValues: UpdatePatientRequest = {
  phone: "",
  emergencyContact: "",
  emergencyPhone: "",
  firstName: "",
  lastName: "",
  country: "",
  location: "",
  nationalId: "",
  insurance: "",
  occupation: "",
  medicalHistory: "",
  allergies: "",
  bloodType: "",
  height: "",
  weight: "",
};

export default function UpdateAccount() {
  const router = useIonRouter();
  const localUser = useLocalUserStore((s) => s.localUser);
  const setLocalUser = useLocalUserStore((s) => s.setLocalUser);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);
  const updateAccountMutation = useUpdateFullAccountInfoMutation();
  const [hasPrefilled, setHasPrefilled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const patientQuery = usePatientDetailQuery(localUser?.id ?? "", !isEditing);
  const [initialValues, setInitialValues] =
    useState<UpdatePatientRequest>(defaultValues);
  const [pendingValues, setPendingValues] =
    useState<UpdatePatientRequest | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePatientRequest>({
    resolver: valibotResolver(UpdatePatientRequestSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!patientQuery.isSuccess || hasPrefilled || !patientQuery.data?.data) {
      return;
    }

    const patient = patientQuery.data.data;

    const nextValues: UpdatePatientRequest = {
      phone: stripVietnamPrefix(patient.accountInfo.phone),
      emergencyContact: patient.emergencyContact ?? "",
      emergencyPhone: stripVietnamPrefix(patient.emergencyPhone),
      firstName: patient.accountInfo.firstName ?? "",
      lastName: patient.accountInfo.lastName ?? "",
      country: patient.accountInfo.address ?? "",
      location: patient.accountInfo.address ?? "",
      nationalId: patient.nationalId ?? "",
      insurance: patient.insurance ?? "",
      occupation: patient.occupation ?? "",
      medicalHistory: patient.medicalHistory ?? "",
      allergies: patient.allergies ?? "",
      bloodType: patient.bloodType ?? "",
      height: patient.height ? String(patient.height) : "",
      weight: patient.weight ? String(patient.weight) : "",
    };

    reset(nextValues);
    setInitialValues(nextValues);
    setHasPrefilled(true);
  }, [hasPrefilled, patientQuery.data?.data, patientQuery.isSuccess, reset]);

  const isSaving = updateAccountMutation.isPending;
  const showOverlay = patientQuery.isLoading || updateAccountMutation.isPending;

  function handleCancelEdit() {
    reset(initialValues);
    setPendingValues(null);
    setIsConfirmOpen(false);
    setIsEditing(false);
  }

  function handleStartEdit() {
    setIsEditing(true);
  }

  function handleSaveClick() {
    handleSubmit((values) => {
      setPendingValues(values);
      setIsConfirmOpen(true);
    })();
  }

  async function handleConfirmSave() {
    if (!pendingValues) return;

    const patientId = patientQuery.data?.data.id ?? localUser?.id ?? "";
    if (!patientId) return;

    const payload = {
      patientId,
      firstName: pendingValues.firstName.trim(),
      lastName: pendingValues.lastName.trim(),
      location: pendingValues.location.trim(),
      country: pendingValues.country.trim(),
      nationalId: pendingValues.nationalId.trim(),
      emergencyContact: pendingValues.emergencyContact.trim(),
      insurance: pendingValues.insurance.trim(),
      occupation: pendingValues.occupation.trim(),
      medicalHistory: pendingValues.medicalHistory.trim(),
      allergies: pendingValues.allergies.trim(),
      bloodType: pendingValues.bloodType.trim(),
      height:
        pendingValues.height.trim() === ""
          ? undefined
          : Number.parseFloat(pendingValues.height),
      weight:
        pendingValues.weight.trim() === ""
          ? undefined
          : Number.parseFloat(pendingValues.weight),
      ...(pendingValues.phone !== "" ? { phone: pendingValues.phone } : {}),
      ...(pendingValues.emergencyPhone !== ""
        ? { emergencyPhone: pendingValues.emergencyPhone }
        : {}),
    };

    setIsConfirmOpen(false);

    updateAccountMutation.mutate(payload, {
      onError: (error) => {
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIconColor: "danger",
        });
      },
      onSuccess: (data) => {
        openGenericDialog({
          title: "Update successful",
          content: "Your account information has been updated.",
          svgIconColor: "success",
          buttons: {
            text: "OK",
            color: "primary",
            closeFn: () => {
              const account = data.data.accountInfo;
              const resetValues: UpdatePatientRequest = {
                ...pendingValues,
                phone: stripVietnamPrefix(pendingValues.phone),
                emergencyPhone: stripVietnamPrefix(
                  pendingValues.emergencyPhone
                ),
              };

              setLocalUser({
                id: account.id,
                userName: account.username,
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                roleId: account.roleId,
                roleName: localUser?.roleName ?? "",
                gender: account.gender,
              });
              setInitialValues(resetValues);
              reset(resetValues);
              setIsEditing(false);
              router.goBack();
            },
          },
        });
      },
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Update Information</IonTitle>
          {!isEditing ? (
            <IonButtons slot="end">
              <IonButton
                color="primary"
                onClick={handleStartEdit}
                disabled={patientQuery.isLoading}
              >
                Edit
              </IonButton>
            </IonButtons>
          ) : (
            <>
              <IonButtons slot="secondary">
                <IonButton
                  color="medium"
                  onClick={handleCancelEdit}
                  disabled={isSaving || patientQuery.isLoading}
                >
                  Cancel
                </IonButton>
              </IonButtons>
              <IonButtons slot="primary">
                <IonButton
                  color="primary"
                  onClick={handleSaveClick}
                  disabled={isSaving || patientQuery.isLoading}
                >
                  Save
                </IonButton>
              </IonButtons>
            </>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-bg-neutral-100">
        <div className="relative min-h-0">
          {showOverlay && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
              <IonSpinner name="circular" className="text-blue-500 size-10" />
            </div>
          )}

          <div className="flex flex-col gap-5 bg-slate-200 p-6 min-h-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <Phone className="size-5" />
                <p className="text-lg font-semibold">Contact & Identity</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <IonInput
                      mode="md"
                      fill="outline"
                      label="First Name"
                      labelPlacement="stacked"
                      value={field.value}
                      onIonInput={(e) =>
                        field.onChange((e.detail.value as string) ?? "")
                      }
                      onIonBlur={field.onBlur}
                      ref={field.ref}
                      className={cn(
                        "ion-bg-white! ion-b-r-[7px]! ",
                        fieldState.error && "ion-invalid ion-touched"
                      )}
                      clearInput={true}
                      disabled={!isEditing || patientQuery.isLoading}
                      errorText={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <IonInput
                      mode="md"
                      fill="outline"
                      label="Last Name"
                      labelPlacement="stacked"
                      value={field.value}
                      onIonInput={(e) =>
                        field.onChange((e.detail.value as string) ?? "")
                      }
                      onIonBlur={field.onBlur}
                      ref={field.ref}
                      className={cn(
                        "ion-bg-white! ion-b-r-[7px]! ",
                        fieldState.error && "ion-invalid ion-touched"
                      )}
                      clearInput={true}
                      disabled={!isEditing || patientQuery.isLoading}
                      errorText={errors.lastName?.message}
                    />
                  )}
                />
              </div>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    type="tel"
                    inputmode="tel"
                    fill="outline"
                    label="Phone"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    helperText="9 digits, numbers only. Phone number without the leading 0."
                    errorText={errors.phone?.message}
                  >
                    <p slot="start">+84</p>
                  </IonInput>
                )}
              />
              <Controller
                name="emergencyContact"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Emergency Contact"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.emergencyContact?.message}
                  />
                )}
              />
              <Controller
                name="emergencyPhone"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    type="tel"
                    inputmode="tel"
                    fill="outline"
                    label="Emergency Phone"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    helperText="9 digits, numbers only. Phone number without the leading 0."
                    errorText={errors.emergencyPhone?.message}
                  >
                    <p slot="start">+84</p>
                  </IonInput>
                )}
              />
              <Controller
                name="nationalId"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    inputmode="numeric"
                    fill="outline"
                    label="Citizen ID Card"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    helperText="12 digits, numbers only."
                    errorText={errors.nationalId?.message}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <MapPin className="size-5" />
                <p className="text-lg font-semibold">Address</p>
              </div>
              <Controller
                name="country"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Country"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.country?.message}
                  />
                )}
              />
              <Controller
                name="location"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Location"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.location?.message}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <ShieldCheck className="size-5" />
                <p className="text-lg font-semibold">Coverage & Work</p>
              </div>
              <Controller
                name="insurance"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Insurance"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.insurance?.message}
                  />
                )}
              />
              <Controller
                name="occupation"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Occupation"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.occupation?.message}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2 text-slate-700">
                <Stethoscope className="size-5" />
                <p className="text-lg font-semibold">Medical Details</p>
              </div>
              <Controller
                name="medicalHistory"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Medical History"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.medicalHistory?.message}
                  />
                )}
              />
              <Controller
                name="allergies"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Allergies"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.allergies?.message}
                  />
                )}
              />
              <Controller
                name="bloodType"
                control={control}
                render={({ field, fieldState }) => (
                  <IonInput
                    mode="md"
                    fill="outline"
                    label="Blood Type"
                    labelPlacement="stacked"
                    value={field.value}
                    onIonInput={(e) =>
                      field.onChange((e.detail.value as string) ?? "")
                    }
                    onIonBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      "ion-bg-white! ion-b-r-[7px]! ",
                      fieldState.error && "ion-invalid ion-touched"
                    )}
                    clearInput={true}
                    disabled={!isEditing || patientQuery.isLoading}
                    errorText={errors.bloodType?.message}
                  />
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="height"
                  control={control}
                  render={({ field, fieldState }) => (
                    <IonInput
                      mode="md"
                      type="number"
                      fill="outline"
                      label="Height"
                      labelPlacement="stacked"
                      value={field.value}
                      onIonInput={(e) =>
                        field.onChange((e.detail.value as string) ?? "")
                      }
                      onIonBlur={field.onBlur}
                      ref={field.ref}
                      className={cn(
                        "ion-bg-white! ion-b-r-[7px]! ",
                        fieldState.error && "ion-invalid ion-touched"
                      )}
                      disabled={!isEditing || patientQuery.isLoading}
                      errorText={errors.height?.message}
                    >
                      <p slot="end">cm</p>
                    </IonInput>
                  )}
                />
                <Controller
                  name="weight"
                  control={control}
                  render={({ field, fieldState }) => (
                    <IonInput
                      mode="md"
                      type="number"
                      fill="outline"
                      label="Weight"
                      labelPlacement="stacked"
                      value={field.value}
                      onIonInput={(e) =>
                        field.onChange((e.detail.value as string) ?? "")
                      }
                      onIonBlur={field.onBlur}
                      ref={field.ref}
                      className={cn(
                        "ion-bg-white! ion-b-r-[7px]! ",
                        fieldState.error && "ion-invalid ion-touched"
                      )}
                      disabled={!isEditing || patientQuery.isLoading}
                      errorText={errors.weight?.message}
                    >
                      <p slot="end">kg</p>
                    </IonInput>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      <IonModal
        isOpen={isConfirmOpen}
        onDidDismiss={() => setIsConfirmOpen(false)}
        backdropDismiss={!isSaving}
        className="ion-w-fit ion-h-fit ion-b-r-[10px]! ion-box-shadow!"
      >
        <div className="size-full p-4 w-[80vw] max-w-md auto-rows-min grid justify-items-center items-center gap-4">
          <h2 className="my-0! font-semibold! h-fit w-full text-center">
            Confirm update?
          </h2>
          <p className="text-sm text-center">
            You are about to update your account information.
          </p>
          <div className="flex gap-2 w-full">
            <IonButton
              fill="solid"
              color="medium"
              className="flex-1"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </IonButton>
            <IonButton
              fill="solid"
              color="primary"
              className="flex-1"
              onClick={handleConfirmSave}
              disabled={isSaving}
            >
              {isSaving ? <IonSpinner name="circular" /> : "Confirm"}
            </IonButton>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
}
