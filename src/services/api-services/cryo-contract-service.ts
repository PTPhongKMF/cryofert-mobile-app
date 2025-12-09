import {
  CryoContractApiResponseSchema,
  type CryoContractApiResponse,
  CryoContractListApiResponseSchema,
  type CryoContractListApiResponse,
  type CryoContractStatus,
  CryoContractTemplateApiResponseSchema,
  type CryoContractTemplateApiResponse,
} from "@src/schemas/cryo-contract";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export interface CreateCryoContractSample {
  labSampleId: string;
  notes?: string;
}

export interface CreateCryoContractRequest {
  patientId: string;
  cryoPackageId: string;
  notes?: string;
  samples: CreateCryoContractSample[];
}

export async function createCryoContractMutationFn(
  payload: CreateCryoContractRequest
): Promise<CryoContractApiResponse> {
  const res = await httpClient
    .post("api/cryostoragecontracts", {
      json: payload,
    })
    .json();

  return v.parse(CryoContractApiResponseSchema, res);
}

export async function cryoContractInfiniteQueryFn(params: {
  patientId: string;
  pageSize: number;
  pageParam: number;
  status?: CryoContractStatus;
  fromDate?: string;
  toDate?: string;
}): Promise<CryoContractListApiResponse> {
  const res = await httpClient
    .get("api/cryostoragecontracts", {
      searchParams: {
        patientId: params.patientId,
        status: params.status,
        fromDate: params.fromDate,
        toDate: params.toDate,
        page: params.pageParam,
        size: params.pageSize,
      },
    })
    .json();

  return v.parse(CryoContractListApiResponseSchema, res);
}

export async function getContractTemplate(
  id: string
): Promise<CryoContractTemplateApiResponse> {
  const res = await httpClient
    .get(`api/cryostoragecontracts/${id}/contract-html`)
    .json();

  return v.parse(CryoContractTemplateApiResponseSchema, res);
}

export async function requestSignCryoContractMutationFn(
  id: string
): Promise<void> {
  await httpClient.post("api/cryostoragecontracts/send-otp", {
    searchParams: { ContractId: id },
  });
}

export async function verifySignCryoContractMutationFn(params: {
  id: string;
  otpCode: string;
}): Promise<CryoContractApiResponse> {
  const res = await httpClient
    .post("api/cryostoragecontracts/verify-otp", {
      searchParams: { ContractId: params.id, Otp: params.otpCode },
    })
    .json();

  return v.parse(CryoContractApiResponseSchema, res);
}

