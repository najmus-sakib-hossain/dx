import { z } from "zod";
import { VALIDATION_LIMITS } from "../constants";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(
      VALIDATION_LIMITS.POST_TITLE_MAX,
      `Title must be less than ${VALIDATION_LIMITS.POST_TITLE_MAX} characters`
    )
    .trim(),
  body: z
    .string()
    .min(1, "Body is required")
    .max(
      VALIDATION_LIMITS.POST_BODY_MAX,
      `Body must be less than ${VALIDATION_LIMITS.POST_BODY_MAX} characters`
    )
    .trim(),
  userId: z.number().int().positive(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
