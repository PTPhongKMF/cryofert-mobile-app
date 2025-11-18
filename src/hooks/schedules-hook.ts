import { useQuery } from "@tanstack/react-query";
import { doctorScheduleBusyQueryFn } from "@src/services/api-services/schedules-service";

export function useDoctorScheduleBusyQuery(doctorId: string, fromDate: string) {
  return useQuery({
    queryKey: ["api/doctor-schedules/busy-dates", doctorId, fromDate],
    queryFn: () => doctorScheduleBusyQueryFn({ doctorId, fromDate }),
    enabled: !!doctorId,
  });
}



