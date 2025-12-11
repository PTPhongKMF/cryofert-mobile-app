import type { PatientApiResponse, PatientResponse } from "@src/schemas/account";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import {
  patientDetailQueryFn,
  updateAccountInfo,
  updatePatientInfo,
  type UpdateAccountInfoRequest,
  type UpdatePatientInfoRequest,
} from "@src/services/api-services/account-service";

export function usePatientDetailQuery(
  patientId: string,
  enabled: boolean = true
) {
  return useQuery<PatientApiResponse, HTTPError>({
    queryKey: ["api/patient/details", patientId, enabled],
    queryFn: () => patientDetailQueryFn({ patientId }),
    enabled: enabled,
  });
}

export function usePatientHasRequiredInfo(
  patientId: string,
  enabled: boolean = true
) {
  return useQuery<boolean, Error>({
    queryKey: ["api/patient/has-required-info", patientId, enabled],
    queryFn: async () => {
      const res = await patientDetailQueryFn({ patientId });
      const patient = res.data;
      const accountInfo = patient.accountInfo;
      const missingFields: string[] = [];

      const isEmptyString = (value: string | null | undefined) =>
        value === null || value === undefined || value.trim() === "";

      if (isEmptyString(accountInfo.firstName)) {
        missingFields.push("firstName");
      }

      if (isEmptyString(accountInfo.lastName)) {
        missingFields.push("lastName");
      }

      if (isEmptyString(accountInfo.birthDate)) {
        missingFields.push("birthDate");
      }

      if (isEmptyString(patient.nationalId)) {
        missingFields.push("Citizen ID Card");
      }

      if (accountInfo.gender === null || accountInfo.gender === undefined) {
        missingFields.push("gender");
      }

      if (isEmptyString(accountInfo.phone)) {
        missingFields.push("phone");
      }

      if (isEmptyString(accountInfo.address)) {
        missingFields.push("address");
      }

      if (missingFields.length > 0) {
        throw new Error(missingFields.join(", "));
      }

      return true;
    },
    enabled: enabled,
  });
}

export function useUpdateFullAccountInfoMutation() {
  type UpdateFullAccountPayload = {
    patientId: string;
  } & Partial<
    Omit<UpdateAccountInfoRequest, "id"> & Omit<UpdatePatientInfoRequest, "id">
  >;

  return useMutation<PatientApiResponse, Error, UpdateFullAccountPayload>({
    mutationFn: async (payload) => {
      const {
        patientId,
        firstName,
        lastName,
        phone,
        address,
        location,
        country,
        nationalId,
        emergencyContact,
        emergencyPhone,
        insurance,
        occupation,
        medicalHistory,
        allergies,
        bloodType,
        height,
        weight,
      } = payload;

      const accountInfoBody: UpdateAccountInfoRequest = {
        id: patientId,
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(location !== undefined && { location }),
        ...(country !== undefined && { country }),
      };

      const patientInfoBody: UpdatePatientInfoRequest = {
        id: patientId,
        ...(nationalId !== undefined && { nationalId }),
        ...(emergencyContact !== undefined && { emergencyContact }),
        ...(emergencyPhone !== undefined && { emergencyPhone }),
        ...(insurance !== undefined && { insurance }),
        ...(occupation !== undefined && { occupation }),
        ...(medicalHistory !== undefined && { medicalHistory }),
        ...(allergies !== undefined && { allergies }),
        ...(bloodType !== undefined && { bloodType }),
        ...(height !== undefined && { height }),
        ...(weight !== undefined && { weight }),
        isActive: true,
      };

      const [_, patientRes] = await Promise.all([
        updateAccountInfo(accountInfoBody),
        updatePatientInfo(patientInfoBody),
      ]);

      return patientRes;
    },
  });
}
