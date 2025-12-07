import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const UpdatePatientRequestSchema = v.object({
  patientCode: v.optional(v.string()),
  nationalId: v.optional(v.string()),
  emergencyContact: v.optional(v.string()),
  emergencyPhone: v.optional(v.string()),
  insurance: v.optional(v.string()),
  occupation: v.optional(v.string()),
  medicalHistory: v.optional(v.string()),
  allergies: v.optional(v.string()),
  bloodType: v.optional(v.string()),
  height: v.optional(v.number()),
  weight: v.optional(v.number()),
  notes: v.optional(v.string()),
  isActive: v.optional(v.boolean()),
});

/////////////////////////////////////////////////////////////

export type UpdatePatientRequest = v.InferOutput<
  typeof UpdatePatientRequestSchema
>;

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
export const AccountInfoApiResponseSchema =
  createApiResponseSchema(AccountInfoResponseSchema);

export type AccountInfoResponse = v.InferOutput<
  typeof AccountInfoResponseSchema
>;

export type PatientResponse = v.InferOutput<typeof PatientResponseSchema>;

export type PatientApiResponse = v.InferOutput<typeof PatientApiResponseSchema>;
export type AccountInfoApiResponse = v.InferOutput<typeof AccountInfoApiResponseSchema>;
