import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonFooter,
  IonHeader,
  IonImg,
  IonModal,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import type {
  BookAppointmentForm,
  BookAppointmentRequest,
} from "@src/schemas/appointment";
import { BookAppointmentFormSchema } from "@src/schemas/appointment";
import { Controller, useForm } from "react-hook-form";
import ChildIcon from "@assets/images/child.png";
import { useLocalUserStore } from "@src/stores/user";
import { useBookingAppointmentMutation } from "@src/services/api-services/appointment-service";
import { useEffect } from "react";
import { useAppLoadingStore } from "@src/stores/app-loading";
import { useShallow } from "zustand/react/shallow";
import { useGenericDialogStore } from "@src/stores/dialog";
import { alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { useSlotsQuery } from "@src/services/api-services/slot-service";
import { cn } from "@utils/cn";

const LOADER_KEY = "booking";

export default function TreatmentBooking() {
  const { startLoading, stopLoading } = useAppLoadingStore(
    useShallow((s) => ({
      startLoading: s.startLoading,
      stopLoading: s.stopLoading,
    }))
  );
  const localUser = useLocalUserStore((s) => s.localUser);
  const openGenericDialog = useGenericDialogStore((s) => s.openGenericDialog);

  const router = useIonRouter();
  const slotsQuery = useSlotsQuery();
  const bookingMutation = useBookingAppointmentMutation();

  const bookingForm = useForm<BookAppointmentForm>({
    defaultValues: {
      appointmentDate: new Date().toISOString(),
      slotId: "",
      notes: "",
    },
    reValidateMode: "onSubmit",
    resolver: valibotResolver(BookAppointmentFormSchema),
  });

  useEffect(() => {
    if (bookingMutation.isPending || slotsQuery.isPending) {
      startLoading(LOADER_KEY);
    } else {
      stopLoading(LOADER_KEY);
    }
  }, [
    bookingMutation.isPending,
    slotsQuery.isPending,
    startLoading,
    stopLoading,
  ]);

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
      onSuccess: () => {
        openGenericDialog({
          title: "Booking Completed",
          svgIcon: checkmarkCircleOutline,
          svgIconColor: "success",
          backdropDismiss: false,
          showBtn: true,
          btnColor: "success",
          closeFn: () => router.goBack(),
        });
      },
    });
    console.log(req);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="ios">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Treatment Booking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-bg-blue-100">
        <div className="flex flex-col justify-center items-center size-full gap-14 p-2">
          <div className="w-full px-6 flex flex-col items-center text-center gap-3">
            <div className="flex items-center gap-3">
              <IonImg src={ChildIcon} className="size-20" />

              <h2 className="text-lg! font-semibold! uppercase text-blue-600">
                Your fertility journey starts here
              </h2>
            </div>

            <p className="w-full text-sm text-slate-600">
              IUI, IVF or a specialist consultation — personalised treatment
              plans, caring support, and clear next steps. We'll help you choose
              the path that's right for you.
            </p>
          </div>

          <form
            id="book-form"
            noValidate
            onSubmit={bookingForm.handleSubmit(handleBooking)}
            className="grow w-full flex flex-col justify-start items-center px-2 gap-10"
          >
            <Controller
              name="appointmentDate"
              control={bookingForm.control}
              render={(appointmentDate) => (
                <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
                  <div
                    className="flex justify-between items-center w-full
                  bg-neutral-50 py-2 rounded-md px-2"
                  >
                    <label className="">Date</label>

                    <IonDatetimeButton
                      datetime="appointment-date"
                      className="self-center"
                    ></IonDatetimeButton>
                  </div>

                  <IonNote className="ps-1">
                    Select a desired date for your appointment.
                  </IonNote>

                  <IonModal
                    keepContentsMounted
                    initialBreakpoint={1}
                    breakpoints={[0, 0.5, 1]}
                    className="ion-w-[100%]!"
                  >
                    <IonDatetime
                      id="appointment-date"
                      presentation="date"
                      min={new Date().toISOString()}
                      showAdjacentDays
                      value={appointmentDate.field.value}
                      onIonChange={appointmentDate.field.onChange}
                      onIonBlur={appointmentDate.field.onBlur}
                      ref={appointmentDate.field.ref}
                      className="bg-transparent! ion-wheel-fade-bg-rgb-white mx-auto w-full my-8"
                    />
                  </IonModal>
                </div>
              )}
            />

            <Controller
              name="slotId"
              control={bookingForm.control}
              render={(slotId) => (
                <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
                  <IonSelect
                    label="Slot (time)"
                    placeholder="Select a slot"
                    interface="action-sheet"
                    errorText={slotId.fieldState.error?.message}
                    value={slotId.field.value}
                    onIonChange={slotId.field.onChange}
                    onIonBlur={slotId.field.onBlur}
                    ref={slotId.field.ref}
                    className={cn(
                      "ion-bg-neutral-50! ion-px-[0.5rem]!",
                      slotId.fieldState.error && "ion-invalid ion-touched"
                    )}
                  >
                    {slotsQuery.data?.data.map((slot) => (
                      <IonSelectOption key={slot.id} value={slot.id}>
                        {slot.startTime} - {slot.endTime}
                      </IonSelectOption>
                    ))}
                  </IonSelect>

                  <IonNote className="ps-1">Slot.</IonNote>
                </div>
              )}
            />

            <Controller
              name="notes"
              control={bookingForm.control}
              render={(note) => (
                <div className="w-full h-fit flex flex-col justify-center items-start gap-2">
                  <IonTextarea
                    mode="md"
                    label="Note"
                    labelPlacement="start"
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
            />
          </form>
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
