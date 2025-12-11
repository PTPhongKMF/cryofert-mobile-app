import type { MedicalRecordApiResponse } from "@src/schemas/medical-record";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { medicalRecordQueryFn } from "@src/services/api-services/medical-record-service";

export function useMedicalRecordQuery(params: {
  patientId: string;
  appointmentId?: string;
}) {
  return useQuery<MedicalRecordApiResponse, HTTPError>({
    queryKey: ["api/medicalrecord", params.patientId, params.appointmentId],
    queryFn: () => medicalRecordQueryFn(params),
    enabled: !!params.patientId,
  });
}

