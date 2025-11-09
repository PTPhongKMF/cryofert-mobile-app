import * as v from "valibot";

export const UpdatePatientRequestSchema = v.object({
  patientCode: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(50, "Patient code cannot exceed 50 characters.")
    )
  ),
  nationalId: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(20, "National ID cannot exceed 20 characters.")
    )
  ),
  emergencyContact: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(100, "Emergency contact cannot exceed 100 characters.")
    )
  ),
  emergencyPhone: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(20, "Emergency phone cannot exceed 20 characters."),
      v.regex(/^\+?[0-9\s\-()]{7,20}$/, "Invalid phone number format.")
    )
  ),
  insurance: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(100, "Insurance cannot exceed 100 characters.")
    )
  ),
  occupation: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(100, "Occupation cannot exceed 100 characters.")
    )
  ),
  medicalHistory: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(2000, "Medical history cannot exceed 2000 characters.")
    )
  ),
  allergies: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(1000, "Allergies cannot exceed 1000 characters.")
    )
  ),
  bloodType: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(10, "Blood type cannot exceed 10 characters.")
    )
  ),
  height: v.optional(
    v.pipe(
      v.number(),
      v.minValue(0, "Height must be between 0 and 300 cm."),
      v.maxValue(300, "Height must be between 0 and 300 cm.")
    )
  ),
  weight: v.optional(
    v.pipe(
      v.number(),
      v.minValue(0, "Weight must be between 0 and 500 kg."),
      v.maxValue(500, "Weight must be between 0 and 500 kg.")
    )
  ),
  notes: v.optional(
    v.pipe(
      v.string(),
      v.maxLength(1000, "Notes cannot exceed 1000 characters.")
    )
  ),
  isActive: v.optional(v.boolean()),
});

/////////////////////////////////////////////////////////////

export type UpdatePatientRequest = v.InferOutput<
  typeof UpdatePatientRequestSchema
>;
