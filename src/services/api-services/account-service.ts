import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import {
  PatientApiResponseSchema,
  type PatientApiResponse,
} from "@src/schemas/account";

export async function patientDetailQueryFn(params: {
  patientId: string;
}): Promise<PatientApiResponse> {
  const res = await httpClient
    .get(`api/patient/${params.patientId}/details`)
    .json();

  return v.parse(PatientApiResponseSchema, res);
}


