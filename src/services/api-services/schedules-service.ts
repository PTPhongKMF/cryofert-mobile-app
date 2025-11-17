import { httpClient } from "@src/services/api-services/http-service";
import * as v from "valibot";
import { useQuery } from "@tanstack/react-query";
import { DoctorScheduleBusyApiResponseSchema } from "@src/schemas/schedules";
import { format } from "@formkit/tempo";

export function useDoctorScheduleBusyQuery(doctorId: string, fromDate: string) {
  return useQuery({
    queryKey: ["api/doctor-schedules/busy-dates", doctorId, fromDate],
    queryFn: async () => {
      const res = await httpClient
        .get("api/doctor-schedules/busy-dates", {
          searchParams: {
            doctorId: doctorId,
            fromDate: format(fromDate, "YYYY-MM-DD"),
          },
        })
        .json();

      return v.parse(DoctorScheduleBusyApiResponseSchema, res);
    },

    enabled: !!doctorId,
  });
}
