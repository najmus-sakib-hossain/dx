import { z } from "zod";
import { VALIDATION_LIMITS } from "../constants";

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(
      VALIDATION_LIMITS.NOTE_TITLE_MAX,
      `Title must be less than ${VALIDATION_LIMITS.NOTE_TITLE_MAX} characters`
    )
    .trim(),
  content: z
    .string()
    .max(
      VALIDATION_LIMITS.NOTE_CONTENT_MAX,
      `Content must be less than ${VALIDATION_LIMITS.NOTE_CONTENT_MAX} characters`
    )
    .trim()
    .optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const noteIdSchema = z.number().int().positive();
