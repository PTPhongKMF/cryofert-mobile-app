import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

const vietnamPhoneSchema = v.pipe(
  v.string(),
  v.transform((value) => value.trim()),
  v.check((value) => /^\d+$/.test(value), "Phone must contain only numbers"),
  v.check((value) => value.length === 9, "Phone must be 9 digits"),
  v.transform((value) => `+84${value}`)
);

const nationalIdSchema = v.pipe(
  v.string(),
  v.transform((value) => value.trim()),
  v.check((value) => /^\d+$/.test(value), "National ID must contain only numbers"),
  v.check((value) => value.length === 12, "National ID must be 12 digits")
);

export const UpdatePatientRequestSchema = v.object({
  phone: vietnamPhoneSchema,
  emergencyContact: v.string(),
  emergencyPhone: v.pipe(
    v.string(),
    v.transform((value) => value.trim()),
    v.check(
      (value) => value === "" || /^\d+$/.test(value),
      "Emergency phone must contain only numbers"
    ),
    v.check(
      (value) => value === "" || value.length === 9,
      "Emergency phone must be 9 digits"
    ),
    v.transform((value) => (value === "" ? "" : `+84${value}`))
  ),
  firstName: v.pipe(v.string(), v.nonEmpty("First name is required")),
  lastName: v.pipe(v.string(), v.nonEmpty("Last name is required")),
  country: v.string(),
  address: v.pipe(v.string(), v.nonEmpty("Address is required")),
  nationalId: nationalIdSchema,
  insurance: v.string(),
  occupation: v.string(),
  medicalHistory: v.string(),
  allergies: v.string(),
  bloodType: v.string(),
  height: v.string(),
  weight: v.string(),
});

export type UpdatePatientRequest = v.InferOutput<typeof UpdatePatientRequestSchema>;

///////////////////////////////////////////////////////////////////////////
// Patient details schemas

export const AccountInfoResponseSchema = v.object({
  id: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  birthDate: v.nullable(v.string()),
  age: v.number(),
  gender: v.boolean(),
  username: v.string(),
  email: v.string(),
  phone: v.string(),
  address: v.nullable(v.string()),
  avatarId: v.nullable(v.string()),
  lastLogin: v.nullable(v.string()),
  roleId: v.string(),
  isVerified: v.boolean(),
  isActive: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
});

export const PatientResponseSchema = v.object({
  id: v.string(),
  patientCode: v.string(),
  nationalId: v.nullable(v.string()),
  emergencyContact: v.nullable(v.string()),
  emergencyPhone: v.nullable(v.string()),
  insurance: v.nullable(v.string()),
  occupation: v.nullable(v.string()),
  medicalHistory: v.nullable(v.string()),
  allergies: v.nullable(v.string()),
  bloodType: v.nullable(v.string()),
  height: v.nullable(v.number()),
  weight: v.nullable(v.number()),
  bmi: v.nullable(v.number()),
  isActive: v.boolean(),
  notes: v.nullable(v.string()),
  accountId: v.string(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
  accountInfo: AccountInfoResponseSchema,
});

export const UserResponseSchema = v.object({
  ...PatientResponseSchema.entries,
  accountInfo: v.unknown(),
});

export const PatientApiResponseSchema = createApiResponseSchema(
  PatientResponseSchema
);
export const AccountInfoApiResponseSchema = createApiResponseSchema(
  AccountInfoResponseSchema
);

export type AccountInfoResponse = v.InferOutput<
  typeof AccountInfoResponseSchema
>;

export type PatientResponse = v.InferOutput<typeof PatientResponseSchema>;

export type PatientApiResponse = v.InferOutput<typeof PatientApiResponseSchema>;
export type AccountInfoApiResponse = v.InferOutput<
  typeof AccountInfoApiResponseSchema
>;
