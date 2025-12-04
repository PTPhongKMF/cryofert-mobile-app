import type { PatientApiResponse } from "@src/schemas/account";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { patientDetailQueryFn } from "@src/services/api-services/account-service";

export function usePatientDetailQuery(patientId: string, enabled: boolean = true) {
  return useQuery<PatientApiResponse, HTTPError>({
    queryKey: ["api/patient/details", patientId],
    queryFn: () => patientDetailQueryFn({ patientId }),
    enabled: enabled,
  });
}


