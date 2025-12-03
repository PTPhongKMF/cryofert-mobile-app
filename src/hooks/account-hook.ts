import type { PatientApiResponse } from "@src/schemas/account";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { patientDetailQueryFn } from "@src/services/api-services/account-service";
import { useEffect, useState } from "react";

export function usePatientDetailQuery(patientId: string, enableOnce?: boolean) {
  const [enabled, setEnabled] = useState<boolean>(!!patientId);

  const query = useQuery<PatientApiResponse, HTTPError>({
    queryKey: ["api/patient/details", patientId],
    queryFn: () => patientDetailQueryFn({ patientId }),
    enabled: enabled,
  });

  useEffect(() => {
    if (enableOnce && query.isSuccess) {
      setEnabled(false);
    }
  }, [enableOnce, query.isSuccess]);

  return query;
}


