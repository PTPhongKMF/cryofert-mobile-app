import type { ServiceRequestApiResponse } from "@src/schemas/service-request";
import { ServiceRequestApiResponseSchema } from "@src/schemas/service-request";
import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";

export async function serviceRequestInAppointmentQueryFn(params: {
  appointmentId: string;
}): Promise<ServiceRequestApiResponse> {
  const res = await httpClient
    .get(`api/servicerequest/appointment/${params.appointmentId}`)
    .json();

  return v.parse(ServiceRequestApiResponseSchema, res);
}

