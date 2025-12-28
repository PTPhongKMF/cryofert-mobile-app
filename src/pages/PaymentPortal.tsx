import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useLocation } from "react-router";
import VNPayLogo from "@assets/images/logos/vnpay.webp";
import { useVnPayPayment } from "@src/hooks/vnpay-hook";
import { useGenericDialogStore } from "@src/stores/dialog";
import { useShallow } from "zustand/react/shallow";
import { alertCircleOutline, checkmarkCircleOutline } from "ionicons/icons";
import { ROUTES } from "@src/routes/routes";
import { useEffect } from "react";
import { useLocalUserStore } from "@src/stores/user";
import * as v from "valibot";
import { CreateTransactionRequestSchema } from "@src/schemas/transaction";

export default function PaymentPortal() {
  const location = useLocation();
  const router = useIonRouter();

  const searchParams = new URLSearchParams(location.search);
  const relatedEntityType = searchParams.get("relatedEntityType");
  const relatedEntityId = searchParams.get("relatedEntityId");
  const paymentFor = searchParams.get("paymentFor");

  const openGenericDialog = useGenericDialogStore(
    useShallow((s) => s.openGenericDialog)
  );

  const VnPayPayment = useVnPayPayment({
    onSuccess: (transactionCode) => {
      openGenericDialog({
        title: "Payment Successful",
        content: transactionCode,
        svgIcon: checkmarkCircleOutline,
        svgIconColor: "success",
        backdropDismiss: false,
        buttons: {
          text: "Ok",
          color: "primary",
          closeFn: () => {
            router.goBack();
          },
        },
      });
    },
    onError: (error) => {
      openGenericDialog({
        title: "Payment Failed",
        content:
          error.message || "An error occurred during payment processing.",
        svgIcon: alertCircleOutline,
        svgIconColor: "danger",
      });
    },
  });

  useEffect(() => {
    if (
      location.pathname === ROUTES.PAYMENT_PORTAL &&
      !relatedEntityType &&
      !relatedEntityId
    ) {
      if (router.canGoBack()) {
        router.goBack();
      } else {
        router.push(ROUTES.T_HOME, "back");
      }
    }
  }, [location.pathname, router, relatedEntityType, relatedEntityId]);

  async function handleVnPay() {
    const res = v.safeParse(CreateTransactionRequestSchema, {
      paymentGateway: "VnPay",
      relatedEntityId: relatedEntityId,
      relatedEntityType: relatedEntityType,
    });

    if (!res.success) {
      openGenericDialog({
        title: "Something went wrong",
        svgIcon: alertCircleOutline,
        svgIconColor: "danger",
        backdropDismiss: true,
        buttons: {
          text: "Ok",
          color: "danger",
          closeFn: () =>
            router.canGoBack()
              ? router.goBack()
              : router.push(ROUTES.T_HOME, "back", "replace"),
        },
      });
    } else {
      await VnPayPayment.initiatePayment(res.output);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.T_HOME} />
          </IonButtons>
          <IonTitle>Payment Portal</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div
          className="relative size-full flex flex-col justify-start items-center gap-10 pt-8
        bg-gradient-to-br from-sky-50 from-10% via-cyan-50 to-blue-50 to-90%"
        >
          {VnPayPayment.isPaymentInProgress && (
            <div className="absolute inset-0 z-20 bg-black/60 pointer-events-auto flex items-center justify-center">
              <IonSpinner name="crescent" />
            </div>
          )}

          <p className="text-2xl font-semibold text-blue-500">
            CryoFert Online Payment Portal
          </p>

          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">
              {paymentFor ? "Payment for" : "Payment"}
            </p>
            {paymentFor && (
              <p className="mt-2 text-lg font-medium text-slate-700">
                {paymentFor}
              </p>
            )}
          </div>

          <div className="size-full flex flex-col justify-start items-center gap-10 pt-8 px-8">
            <button
              onClick={handleVnPay}
              className="w-full bg-white px-2! py-2! h-20 flex justify-start items-center
            rounded-xl! shadow-lg transition-all duration-200"
            >
              <img src={VNPayLogo} className="h-fit w-20" alt="VNPay" />
              <p className="text-xl grow">VNPay</p>
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
