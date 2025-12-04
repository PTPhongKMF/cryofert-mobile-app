import * as v from "valibot";

export const AgreementDataSchema = v.object({
  patient: v.object({
    name: v.string(),
    dob: v.string(),
    nationalId: v.string(),
    address: v.string(),
    phone: v.string(),
  }),
  spouse: v.optional(
    v.object({
      name: v.string(),
      dob: v.string(),
      nationalId: v.string(),
    })
  ),
});

export type AgreementData = v.InferOutput<typeof AgreementDataSchema>;
