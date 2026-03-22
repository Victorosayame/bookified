import { z } from "zod";
import {
  ACCEPTED_PDF_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
} from "./constants";

export const UploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters"),
  author: z
    .string()
    .min(1, "Author name is required")
    .min(2, "Author name must be at least 2 characters")
    .max(100, "Author name must be less than 100 characters"),
  pdfFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "PDF file is required")
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      "Only PDF files are accepted",
    )
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `PDF file must be less than 50MB`,
    ),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size > 0,
      "Cover image cannot be empty",
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, PNG, and WebP images are accepted",
    )
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      "Cover image must be less than 10MB",
    ),
  persona: z.string().min(1, "Please select a voice"),
});
