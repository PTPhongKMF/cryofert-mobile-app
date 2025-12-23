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
import { getDateOnly } from "@utils/date";
import { HTTPError } from "ky";
import * as v from "valibot";

export async function loginMutationFn(
  req: LoginRequest
): Promise<LoginApiResponse> {
  let res;

  try {
    res = await httpClient
      .post("api/auth/login", {
        json: {
          email: req.email,
          password: req.password,
          mobile: true,
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
}

export async function registerMutationFn(
  req: RegisterRequest
): Promise<GenericApiResponse> {
  const res = await httpClient
    .post("api/auth/register", {
      json: {
        email: req.email,
        password: req.password,
        birthDate: getDateOnly(req.birthDate),
        gender: req.gender,
      },
    })
    .json();

  return v.parse(GenericApiResponseSchema, res);
}

export async function confirmOtpMutationFn(
  req: ConfirmOtpRequest
): Promise<void> {
  await httpClient
    .post("api/auth/verify-email", {
      json: { email: req.email, verificationCode: req.verificationCode },
    })
    .json();
}

export async function resendOtpMutationFn(email: string): Promise<void> {
  await httpClient
    .post("api/auth/send-verification-email", {
      json: {
        email: email,
      },
    })
    .json();
}
