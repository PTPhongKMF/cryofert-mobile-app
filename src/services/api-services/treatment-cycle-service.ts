import type { TreatmentCycleListApiResponse } from "@src/schemas/treatment-cycle";
import { TreatmentCycleListApiResponseSchema } from "@src/schemas/treatment-cycle";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function treatmentCycleListQueryFn(params: {
  treatmentId: string;
  patientId: string;
}) {
  const res = await httpClient
    .get("api/treatment-cycles", {
      searchParams: {
        treatmentId: params.treatmentId,
        patientId: params.patientId,
        sort: "cycleNumber",
        order: "asc",
      },
    })
    .json();

  return v.parse(TreatmentCycleListApiResponseSchema, res);
}
