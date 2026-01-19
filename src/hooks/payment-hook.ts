import { InAppBrowser, DefaultWebViewOptions } from "@capacitor/inappbrowser";
import { useCallback, useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import type { CreateTransactionRequest } from "@src/schemas/transaction";
import { useCreateTransactionMutation } from "@src/hooks/transaction-hook";
import { getSecuredToken } from "@src/services/token-service";
import { useLocalUserStore } from "@src/stores/user";
import { baseApiUrl } from "@src/services/api-services/http-service";

export interface UseCreatePaymentOptions {
  onSuccess?: (transactionCode: string, status: string) => void;
  onError?: (error: Error) => void;
}

export function useCreatePayment(options: UseCreatePaymentOptions) {
  const { onSuccess, onError } = options;
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const localUser = useLocalUserStore((s) => s.localUser);

  const createPaymentMutation = useCreateTransactionMutation();

  const closeBrowser = useCallback(async () => {
    InAppBrowser.removeAllListeners();
    await InAppBrowser.close();

    setIsPaymentInProgress(false);
  }, []);

  useEffect(() => {
    if (!localUser?.id) {
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${baseApiUrl}transactionHub`, {
        accessTokenFactory: async () => {
          const token = await getSecuredToken("access-token");
          return token || "";
        },
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connected to TransactionHub");
      })
      .catch((err) => {
        console.error("Error connecting to TransactionHub:", err);
      });

    connection.on(
      "TransactionUpdated",
      (transactionCode: string, status: string) => {
        console.log("Transaction updated via SignalR:", {
          transactionCode,
          status,
        });

        if (status === "Success" || status === "Completed") {
          onSuccess?.(transactionCode, status);
          setIsPaymentInProgress(false);
          closeBrowser();
        } else if (status === "Failed" || status === "Cancelled") {
          onError?.(new Error(`Payment ${transactionCode}: ${status}`));
          setIsPaymentInProgress(false);
          closeBrowser();
        }
      },
    );

    return () => {
      connection
        .stop()
        .then(() => console.log("Disconnected from TransactionHub"))
        .catch((err) =>
          console.log("Error disconnecting from TransactionHub:", err),
        );
    };
  }, [localUser?.id, onSuccess, onError, closeBrowser]);

  useEffect(() => {
    (async () => {
      await InAppBrowser.addListener("browserClosed", () => {
        setIsPaymentInProgress(false);
      });
    })();

    return () => {
      InAppBrowser.removeAllListeners();
    };
  }, []);

  async function initiatePayment(request: CreateTransactionRequest) {
    setIsPaymentInProgress(true);

    const response = await createPaymentMutation.mutateAsync(request);

    await InAppBrowser.openInWebView({
      url: response.data.paymentUrl,
      options: DefaultWebViewOptions,
    });
  }

  return {
    initiatePayment,
    isPaymentInProgress,
  };
}
