import z from "zod";

export const registerSchema = z
  .object({
    email: z.email(),
    username: z.string().min(2),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password must be at least 8 characters , has at least 1 Cap letter , at least 1 Small letter, and has at least 1 special character",
      ),
    password_confirmation: z  
      .string()
      .min(8)
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "password must be at least 8 characters , has at least 1 Cap letter , at least 1 Small letter, and has at least 1 special character",
      ),
    role:z.enum(["customer","merchant"]),
  })  
  .refine((data) => data.password === data.password_confirmation, {
    error: "password confirmation does not match",
    path: ["password_confirmation"], //Error Path
  });
