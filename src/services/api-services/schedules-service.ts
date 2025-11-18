import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import { DoctorScheduleBusyApiResponseSchema } from "@src/schemas/schedules";
import { format } from "@formkit/tempo";

export async function doctorScheduleBusyQueryFn(params: {
  doctorId: string;
  fromDate: string;
}) {
  const res = await httpClient
    .get("api/doctor-schedules/busy-dates", {
      searchParams: {
        doctorId: params.doctorId,
        fromDate: format(params.fromDate, "YYYY-MM-DD"),
      },
    })
    .json();

  return v.parse(DoctorScheduleBusyApiResponseSchema, res);
}
