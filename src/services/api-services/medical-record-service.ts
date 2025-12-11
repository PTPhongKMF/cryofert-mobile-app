import type { MedicalRecordApiResponse } from "@src/schemas/medical-record";
import { MedicalRecordApiResponseSchema } from "@src/schemas/medical-record";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function medicalRecordQueryFn(params: {
  patientId: string;
  appointmentId?: string;
}): Promise<MedicalRecordApiResponse> {
  const res = await httpClient
    .get("api/medicalrecord", {
      searchParams: {
        patientId: params.patientId,
        appointmentId: params.appointmentId,
        sort: "createdAt",
        order: "desc",
      },
    })
    .json();

  return v.parse(MedicalRecordApiResponseSchema, res);
}

