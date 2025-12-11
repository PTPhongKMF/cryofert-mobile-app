import type { ServiceRequestApiResponse } from "@src/schemas/service-request";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { serviceRequestInAppointmentQueryFn } from "@src/services/api-services/service-request-service";

export function useServiceRequestInAppointment(appointmentId: string) {
  return useQuery<ServiceRequestApiResponse, HTTPError>({
    queryKey: ["api/servicerequest/appointment", appointmentId],
    queryFn: () => serviceRequestInAppointmentQueryFn({ appointmentId }),
    enabled: !!appointmentId,
  });
}

