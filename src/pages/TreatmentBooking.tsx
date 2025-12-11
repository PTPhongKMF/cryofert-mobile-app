import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonImg,
  IonNote,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  BookAppointmentFormSchema,
  type BookAppointmentForm,
  type BookAppointmentRequest,
} from "@src/schemas/appointment";
import { Controller, useForm } from "react-hook-form";
import ChildIcon from "@assets/images/child.png";
import { useEffect, useState } from "react";
import { useLocalUserStore } from "@src/stores/user";
import { useGenericDialogStore } from "@src/stores/dialog";
import { alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { cn } from "@utils/cn";
import DoctorFirst from "@src/components/treatment-booking/DoctorFirst";
import DateFirst from "@src/components/treatment-booking/DateFirst";
import { useSlotsQuery } from "@src/hooks/slot-hook";
import { useCreateBookingAppointmentMutation } from "@src/hooks/appointment-hook";
import { addDay } from "@formkit/tempo";
import { ROUTES } from "@src/routes/routes";
import { usePatientHasRequiredInfo } from "@src/hooks/account-hook";

export default function TreatmentBooking() {
  const localUser = useLocalUserStore((s) => s.localUser);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const router = useIonRouter();

  const patientRequiredInfoQuery = usePatientHasRequiredInfo(
    localUser?.id ?? "",
    !!localUser?.id
  );

  const slotsQuery = useSlotsQuery();
  const bookingMutation = useCreateBookingAppointmentMutation();
  const isLoading = bookingMutation.isPending || slotsQuery.isPending || patientRequiredInfoQuery.isLoading;

  const [formType, setFormType] = useState<"doctor-first" | "date-first">(
    "doctor-first"
  );

  const bookingForm = useForm<BookAppointmentForm>({
    defaultValues: {
      doctorIds: "",
      appointmentDate: addDay(new Date(), 1).toISOString(),
      slotId: "",
      // notes: "",
    },
    reValidateMode: "onSubmit",
    resolver: valibotResolver(BookAppointmentFormSchema),
  });

  function handleBooking(data: BookAppointmentForm) {
    const req: BookAppointmentRequest = {
      ...data,
      patientId: localUser?.id ?? "",
      type: "Booking",
    };

    bookingMutation.mutate(req, {
      onError: (error) => {
        openGenericDialog({
          title: error.name,
          content: error.message,
          svgIcon: alertCircleOutline,
          svgIconColor: "danger",
        });
      },
      onSuccess: (data) => {
        openGenericDialog({
          title: "Booking Completed",
          svgIcon: checkmarkCircleOutline,
          svgIconColor: "success",
          backdropDismiss: false,
          buttons: [
            {
              text: "Pay later",
              color: "medium",
              closeFn: () => router.goBack(),
            },
            {
              text: "Pay now",
              closeFn: () => {
                router.push(
                  `${ROUTES.PAYMENT_PORTAL}?relatedEntityType=Appointment&relatedEntityId=${data.data.id}`,
                  "forward",
                  "replace"
                );
              },
            },
          ],
        });
      },
    });
    console.log(req);
  }

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
        closeFn: () =>
          router.push(ROUTES.UPDATE_ACCOUNT, "forward", "replace"),
      },
    });
  }, [
    openGenericDialog,
    patientRequiredInfoQuery.error?.message,
    patientRequiredInfoQuery.isError,
    router,
  ]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Treatment Booking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-bg-blue-100">
        <div className="relative h-full">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <IonSpinner name="circular" className="text-blue-500 size-8" />
            </div>
          )}

          <div className="flex flex-col justify-center items-center gap-14 px-2 py-4">
            <div className="w-full px-6 flex flex-col items-center text-center gap-3">
              <div className="flex items-center gap-3">
                <IonImg src={ChildIcon} className="size-20" />

                <h2 className="text-lg! font-semibold! uppercase text-blue-600">
                  Your fertility journey starts here
                </h2>
              </div>

              <p className="w-full text-sm text-slate-600">
                IUI, IVF or a specialist consultation — personalised treatment
                plans, caring support, and clear next steps. We'll help you
                choose the path that's right for you.
              </p>
            </div>

            <form
              id="book-form"
              noValidate
              onSubmit={bookingForm.handleSubmit(handleBooking)}
              className="grow w-full flex flex-col justify-start items-center px-2 gap-10"
            >
              <div className="w-full grid grid-cols-2 auto-rows-auto gap-2">
                <p className="col-span-2 self-end text-xl font-semibold">
                  I would like to
                </p>

                <label
                  className={cn(
                    "flex-1 py-3 px-4 rounded-md transition-colors flex items-center justify-center",
                    "text-sm font-medium cursor-pointer",
                    formType === "doctor-first"
                      ? "border-2 border-blue-500 text-blue-600 bg-neutral-50"
                      : "border-2 border-gray-300 text-gray-600 bg-gray-200"
                  )}
                >
                  <input
                    type="radio"
                    value="doctor-first"
                    checked={formType === "doctor-first"}
                    onChange={() => {
                      setFormType("doctor-first");
                      bookingForm.reset();
                      // bookingForm.reset({
                      //   notes: bookingForm.getValues("notes"),
                      // });
                    }}
                    className="appearance-none"
                  />
                  Select a Doctor first
                </label>
                <label
                  className={cn(
                    "flex-1 py-3 px-4 rounded-md transition-colors cursor-pointer flex items-center justify-center",
                    "text-sm font-medium",
                    formType === "date-first"
                      ? "border-2 text-blue-600 border-blue-500 bg-neutral-50"
                      : "border-2 text-gray-600 border-gray-300 bg-gray-200"
                  )}
                >
                  <input
                    type="radio"
                    value="date-first"
                    checked={formType === "date-first"}
                    onChange={() => {
                      setFormType("date-first");
                      bookingForm.reset();
                      // bookingForm.reset({
                      //   notes: bookingForm.getValues("notes"),
                      // });
                    }}
                    className="appearance-none"
                  />
                  Select a Date first
                </label>
              </div>

              {formType === "doctor-first" && (
                <DoctorFirst
                  bookingForm={bookingForm}
                  slotList={slotsQuery.data?.data || []}
                />
              )}

              {formType === "date-first" && (
                <DateFirst
                  bookingForm={bookingForm}
                  slotList={slotsQuery.data?.data || []}
                />
              )}

              {/* <Controller
                name="notes"
                control={bookingForm.control}
                render={(note) => (
                  <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
                    <IonTextarea
                      mode="ios"
                      label="Note"
                      labelPlacement="stacked"
                      fill="outline"
                      autoGrow
                      value={note.field.value}
                      onIonInput={note.field.onChange}
                      onIonBlur={note.field.onBlur}
                      ref={note.field.ref}
                      className="ion-bg-neutral-50! ion-b-r-[6px]! ion-px-[0.5rem]!"
                    />

                    <IonNote className="ps-1">Additional information.</IonNote>
                  </div>
                )}
              /> */}
            </form>
          </div>
        </div>
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-px-[0.5rem]">
          <div className="flex justify-between items-center gap-2">
            <IonButton
              onClick={() => bookingForm.reset()}
              fill="solid"
              color="medium"
              className="w-30"
            >
              Clear
            </IonButton>
            <IonButton
              type="submit"
              form="book-form"
              fill="solid"
              className="grow"
            >
              Book
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
