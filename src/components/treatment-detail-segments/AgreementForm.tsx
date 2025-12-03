import { IonInput } from "@ionic/react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { AgreementData } from "@src/schemas/agreement";
import { cn } from "@src/utils/cn";

interface AgreementFormProps {
  form: UseFormReturn<AgreementData>;
}

export default function AgreementForm(props: AgreementFormProps) {
  const { control } = props.form;

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-2">
      <p className="text-base font-semibold text-gray-700">Patient information</p>

      <Controller
        name="patient.name"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="Full name"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />

      <Controller
        name="patient.dob"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="Date of birth (YYYY-MM-DD)"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />

      <Controller
        name="patient.nationalId"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="National ID"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />

      <Controller
        name="patient.address"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="Address"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />

      <Controller
        name="patient.phone"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="Phone number"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />

      <p className="text-base font-semibold text-gray-700 mt-4">
        Spouse information (optional)
      </p>

      <Controller
        name="spouse.name"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="Full name"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />

      <Controller
        name="spouse.dob"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="Date of birth (YYYY-MM-DD)"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />

      <Controller
        name="spouse.nationalId"
        control={control}
        render={(field) => (
          <IonInput
            placeholder="National ID"
            mode="md"
            fill="outline"
            errorText={field.fieldState.error?.message}
            clearInput={true}
            value={field.field.value}
            onIonInput={field.field.onChange}
            onIonBlur={field.field.onBlur}
            ref={field.field.ref}
            className={cn(
              "ion-bg-white! ion-b-r-[7px]! min-h-[1px]! ion-py-[0.45rem]!",
              field.fieldState.error && "ion-invalid ion-touched"
            )}
          />
        )}
      />
    </div>
  );
}
