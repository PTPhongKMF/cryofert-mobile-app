import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const DoctorResponseSchema = v.object({
  id: v.string(),
  // accountId: v.string(),
  badgeId: v.string(),
  specialty: v.string(),
  certificates: v.string(),
  licenseNumber: v.string(),
  yearsOfExperience: v.number(),
  biography: v.nullable(v.string()),
  joinDate: v.string(),
  leaveDate: v.nullable(v.string()),
  isActive: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.nullable(v.string()),
  account: v.object({
    // id: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    username: v.string(),
    isActive: v.boolean(),
    isVerified: v.boolean(),
  }),
});

///////////////////////////////////////////////////////////////////////

export const DoctorApiResponseSchema = createApiResponseSchema(
  v.array(DoctorResponseSchema)
);

///////////////////////////////////////////////////////////////////////

export type DoctorResponse = v.InferOutput<typeof DoctorResponseSchema>;
export type DoctorApiResponse = v.InferOutput<typeof DoctorApiResponseSchema>;
