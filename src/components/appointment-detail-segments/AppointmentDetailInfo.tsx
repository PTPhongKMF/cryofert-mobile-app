import { format } from "@formkit/tempo";
import type { AppointmentResponse } from "@src/schemas/appointment";

interface AppointmentDetailInfoProps {
  appointment: AppointmentResponse;
}

export default function AppointmentDetailInfo({
  appointment,
}: AppointmentDetailInfoProps) {
  const patient = appointment.patient;
  const slot = appointment.slot;

  let remainingDaysLabel: string | null = null;
  if (appointment.appointmentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(appointment.appointmentDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffMs = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      remainingDaysLabel =
        diffDays === 1 ? "1 day remaining" : `${diffDays} days remaining`;
    } else if (diffDays === 0) {
      remainingDaysLabel = "Appointment is today";
    } else {
      remainingDaysLabel = "Appointment date has passed";
    }
  }

  const doctorNames =
    appointment.doctors.length > 0
      ? appointment.doctors.map((d) => d.fullName).join(", ")
      : "N/A";

  return (
    <div className="px-4 flex flex-col justify-center items-center gap-4">
      <div className="bg-gray-50 w-full p-4 rounded-xl border shadow-lg border-blue-200 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-500 my-2!">
          Basic Information
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Type:</span>
            <span className="font-normal text-xs text-black">
              {appointment.typeName}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Status:</span>
            <span className="font-normal text-xs text-black px-2 py-1 rounded bg-gray-100">
              {appointment.statusName}
            </span>
          </div>

          <div className="bg-gray-200 w-full h-0.5 my-1" />

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">Appointment Date:</span>
            <span className="font-normal text-xs text-black">
              {appointment.appointmentDate
                ? format(appointment.appointmentDate, "MMM DD, YYYY")
                : "N/A"}
            </span>
          </div>

          {slot && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Time:</span>
              <span className="font-normal text-xs text-black">
                {slot.startTime} - {slot.endTime}
              </span>
            </div>
          )}

          {remainingDaysLabel && (
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-base text-blue-800 text-center font-semibold">
              <span className="block mb-1 text-sm uppercase tracking-wide text-blue-500">
                Time Remaining
              </span>
              <span>{remainingDaysLabel}</span>
            </div>
          )}

          {appointment.checkInTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Check-in:</span>
              <span className="font-normal text-xs text-black">
                {appointment.checkInTime
                  ? format(appointment.checkInTime, "HH:mm")
                  : "N/A"}
              </span>
            </div>
          )}

          {appointment.checkOutTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Check-out:</span>
              <span className="font-normal text-xs text-black">
                {appointment.checkOutTime
                  ? format(appointment.checkOutTime, "HH:mm")
                  : "N/A"}
              </span>
            </div>
          )}
        </div>
      </div>

      {patient && (
        <div className="bg-gray-50 w-full p-4 rounded-xl shadow-lg border border-blue-200 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-blue-500 my-2!">
            Patient Information
          </h2>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Name:</span>
              <span className="font-normal text-xs text-black">
                {patient.fullName}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Patient Code:</span>
              <span className="font-normal text-xs text-black">
                {patient.patientCode}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Phone:</span>
              <span className="font-normal text-xs text-black">
                {patient.phone}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Email:</span>
              <span className="font-normal text-xs text-black">
                {patient.email}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 w-full p-4 rounded-xl shadow-lg border border-blue-200 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-500 my-2!">
          Doctor & Notes
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-semibold">Doctor(s):</span>
            <span className="font-normal text-xs text-black">
              {doctorNames}
            </span>
          </div>

          {appointment.reason && (
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">Reason:</span>
              <span className="font-normal text-xs text-black whitespace-pre-wrap">
                {appointment.reason}
              </span>
            </div>
          )}

          {appointment.instructions && (
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">Instructions:</span>
              <span className="font-normal text-xs text-black whitespace-pre-wrap">
                {appointment.instructions}
              </span>
            </div>
          )}

          {appointment.notes && (
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">Notes:</span>
              <span className="font-normal text-xs text-black whitespace-pre-wrap">
                {appointment.notes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
