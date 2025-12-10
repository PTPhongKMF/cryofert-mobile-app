import { useMutation } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import {
  requestSignAgreementMutationFn,
  verifySignAgreementMutationFn,
} from "@src/services/api-services/agreement-service";

export function useRequestSignAgreementMutation() {
  return useMutation<void, HTTPError, string>({
    mutationFn: requestSignAgreementMutationFn,
    onError: (error) => {
      console.log(error);
    },
  });
}

export function useVerifySignAgreementMutation() {
  return useMutation<
    void,
    HTTPError,
    { id: string; otpCode: string }
  >({
    mutationFn: verifySignAgreementMutationFn,
    onError: (error) => {
      console.log(error);
    },
  });
}

