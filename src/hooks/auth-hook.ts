import type { ConfirmOtpRequest } from "@src/components/dialogs/OtpDialog";
import type { GenericApiResponse } from "@src/schemas/api-response";
import type { LoginApiResponse } from "@src/schemas/auth";
import type { LoginRequest, RegisterRequest } from "@src/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import {
  confirmOtpMutationFn,
  loginMutationFn,
  registerMutationFn,
  resendOtpMutationFn,
} from "@src/services/api-services/auth-service";

export function useLoginMutation() {
  return useMutation<LoginApiResponse, HTTPError, LoginRequest>({
    mutationFn: loginMutationFn,
  });
}

export function useRegisterMutation() {
  return useMutation<GenericApiResponse, HTTPError, RegisterRequest>({
    mutationFn: registerMutationFn,
  });
}

export function useConfirmOtpMutation() {
  return useMutation<void, HTTPError, ConfirmOtpRequest>({
    mutationFn: confirmOtpMutationFn,
  });
}

export function useResendOtpMutation() {
  return useMutation<void, HTTPError, string>({
    mutationFn: resendOtpMutationFn,
  });
}



