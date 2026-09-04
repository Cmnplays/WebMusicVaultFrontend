import { z } from "zod";

// Mirrors backend/src/schemas/user.schema.ts -> updateUserSchema so the
// client validates with the exact same rules the API enforces.
const username = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(30, "Username must be less than or equal to 30 characters")
  .regex(
    /^[A-Za-z0-9._]+$/,
    "Username can only contain letters, numbers, dots, and underscores",
  );

const displayName = z
  .string()
  .trim()
  .min(2, "Display name must be at least 2 characters")
  .max(30, "Display name must be less than or equal to 30 characters");

const updateUserSchema = z.object({
  displayName,
  username,
});

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

export { updateUserSchema };
