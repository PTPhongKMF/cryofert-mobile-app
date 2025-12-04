import * as v from "valibot";

export const AgreementFormSchema = v.object({
  patient: v.object({
    name: v.pipe(v.string(), v.nonEmpty("Require")),
    dob: v.pipe(v.string(), v.nonEmpty("Require")),
    nationalId: v.pipe(v.string(), v.nonEmpty("Require")),
    address: v.pipe(v.string(), v.nonEmpty("Require")),
    phone: v.pipe(v.string(), v.nonEmpty("Require")),
  }),
  spouse: v.optional(
    v.object({
      name: v.pipe(v.string(), v.nonEmpty("Require")),
      dob: v.pipe(v.string(), v.nonEmpty("Require")),
      nationalId: v.pipe(v.string(), v.nonEmpty("Require")),
    })
  ),
});

export type AgreementFormData = v.InferOutput<typeof AgreementFormSchema>;
