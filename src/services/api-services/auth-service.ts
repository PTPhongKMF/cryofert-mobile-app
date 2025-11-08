import type { ConfirmOtpRequest } from "@src/components/dialogs/OtpDialog";
import type { GenericApiResponse } from "@src/schemas/api-response";
import { GenericApiResponseSchema } from "@src/schemas/api-response";
import type { LoginApiResponse } from "@src/schemas/auth";
import {
  LoginApiResponseSchema,
  type LoginRequest,
  type RegisterRequest,
} from "@src/schemas/auth";
import { httpClient } from "@src/services/api-services/http-service";
import { useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";
import * as v from "valibot";

export function useLoginMutation() {
  return useMutation<LoginApiResponse, HTTPError, LoginRequest>({
    mutationFn: async (req) => {
      let res;

      try {
        res = await httpClient
          .post("api/auth/login", {
            json: {
              email: req.email,
              password: req.password,
            },
          })
          .json();
      } catch (e) {
        if (e instanceof HTTPError && e.response.status === 403) {
          const raw = await e.response.clone().json();
          const body = v.parse(GenericApiResponseSchema, raw);

          if (body.systemCode === "NEED_OTP") {
            return v.parse(LoginApiResponseSchema, body);
          }
        }

        throw e;
      }

      return v.parse(LoginApiResponseSchema, res);
    },
  });
}

export function useRegisterMutation() {
  return useMutation<GenericApiResponse, HTTPError, RegisterRequest>({
    mutationFn: async (req) => {
      const res = await httpClient
        .post("api/auth/register", {
          json: {
            email: req.email,
            password: req.password,
          },
        })
        .json();

      return v.parse(GenericApiResponseSchema, res);
    },
  });
}

export function useConfirmOtpMutation() {
  return useMutation<void, HTTPError, ConfirmOtpRequest>({
    mutationFn: async (req) => {
      console.log(req);

      await httpClient
        .post("api/auth/verify-email", {
          json: { email: req.email, verificationCode: req.verificationCode },
        })
        .json();
    },
  });
}

export function useResendOtpMutation() {
  return useMutation<void, HTTPError, string>({
    mutationFn: async (email) => {
      console.log(email);

      await httpClient
        .post("api/auth/send-verification-email", {
          json: {
            email: email,
          },
        })
        .json();
    },
  });
}
