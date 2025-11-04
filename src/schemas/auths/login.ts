import * as v from "valibot";

export const LoginRequestSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty("Email không được trống"),
    v.email("Email không hợp lệ"),
  ),
  password: v.pipe(v.string(), v.nonEmpty("Mật khẩu không được trống")),
});

export type LoginRequest = v.InferOutput<typeof LoginRequestSchema>;
