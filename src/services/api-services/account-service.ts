import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import {
  PatientApiResponseSchema,
  type PatientApiResponse,
} from "@src/schemas/account";

export interface UpdateAccountInfoRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  location?: string;
  country?: string;
}

export interface UpdatePatientInfoRequest {
  id: string;
  nationalId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  insurance?: string;
  occupation?: string;
  medicalHistory?: string;
  allergies?: string;
  bloodType?: string;
  height?: number;
  weight?: number;
  isActive?: boolean;
}

export async function patientDetailQueryFn(params: {
  patientId: string;
}): Promise<PatientApiResponse> {
  const res = await httpClient
    .get(`api/patient/${params.patientId}/details`)
    .json();

  return v.parse(PatientApiResponseSchema, res);
}

export async function updateAccountInfo(params: UpdateAccountInfoRequest) {
  const { id, ...payload } = params;
  await httpClient.put(`api/user/${id}`, { json: payload }).json();
}

export async function updatePatientInfo(
  params: UpdatePatientInfoRequest
): Promise<PatientApiResponse> {
  const { id, ...payload } = params;
  const res = await httpClient
    .put(`api/patient/${id}`, { json: payload })
    .json();

  return v.parse(PatientApiResponseSchema, res);
}
