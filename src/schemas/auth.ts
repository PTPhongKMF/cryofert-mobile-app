import { diffYears } from "@formkit/tempo";
import { createApiResponseSchema } from "@src/schemas/api-response";
import * as v from "valibot";

export const LoginRequestSchema = v.object({
  email: v.pipe(v.string(), v.nonEmpty("Required"), v.email("Invalid Email")),
  password: v.pipe(v.string(), v.nonEmpty("Required")),
});

export const RegisterRequestSchema = v.pipe(
  v.variant("gender", [
    v.object({
      ...LoginRequestSchema.entries,
      gender: v.literal(true),
      birthDate: v.pipe(
        v.string(),
        v.custom(
          (input) =>
            typeof input === "string" && diffYears(new Date(), input) >= 20,
          "You must be 20 or older."
        )
      ),
      repeatPassword: v.pipe(v.string(), v.nonEmpty("Required")),
    }),
    v.object({
      ...LoginRequestSchema.entries,
      gender: v.literal(false),
      birthDate: v.pipe(
        v.string(),
        v.custom(
          (input) =>
            typeof input === "string" && diffYears(new Date(), input) >= 18,
          "You must be 18 or older."
        )
      ),
      repeatPassword: v.pipe(v.string(), v.nonEmpty("Required")),
    }),
  ]),
  v.forward(
    v.partialCheck(
      [["password"], ["repeatPassword"]],
      (input) => input.password === input.repeatPassword,
      "Passwords do not match"
    ),
    ["repeatPassword"]
  )
);

/////////////////////////////////////////////////////////////////

const LoginResponseSchema = v.object({
  token: v.nullable(v.string()),
  refreshToken: v.nullable(v.string()),
  user: v.object({
    id: v.string(),
    userName: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    gender: v.nullable(v.boolean()),
    age: v.nullable(v.number()),
    email: v.string(),
    phone: v.string(),
    location: v.nullable(v.string()),
    country: v.nullable(v.string()),
    image: v.nullable(v.string()),
    status: v.boolean(),
    emailVerified: v.boolean(),
    roleId: v.string(),
    roleName: v.string(),
    createdAt: v.string(),
    updatedAt: v.nullable(v.string()),
  }),
  emailVerified: v.boolean(),
});

/////////////////////////////////////////////////////////////

export const LoginApiResponseSchema =
  createApiResponseSchema(LoginResponseSchema);

////////////////////////////////////////////////////////////////

export type LoginRequest = v.InferOutput<typeof LoginRequestSchema>;
export type RegisterRequest = v.InferOutput<typeof RegisterRequestSchema>;

export type LoginApiResponse = v.InferOutput<typeof LoginApiResponseSchema>;
