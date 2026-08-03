import { z } from 'zod'

/**
 * Shared by the client components and the route handlers. Validating with the
 * same schema on both sides is what stops the browser and the server from
 * disagreeing about what a valid submission is.
 */

export const HONEYPOT_FIELD = 'company_website'
export const MIN_SUBMIT_MS = 1200

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Name is too long'),
  company: z.string().trim().max(120, 'Company name is too long').optional(),
  email: z.email('Enter a valid email address'),
  phone: z.string().trim().max(40, 'Phone number is too long').optional(),
  enquiryType: z.enum(['hire', 'project', 'other']),
  message: z
    .string()
    .trim()
    .min(20, 'Tell us a little more — at least 20 characters')
    .max(4000, 'Message is too long'),
})

export const careersSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Name is too long'),
  email: z.email('Enter a valid email address'),
  profileUrl: z.url('Enter a link to your LinkedIn profile or CV'),
  primaryStack: z
    .string()
    .trim()
    .min(2, 'Tell us your primary stack')
    .max(200, 'Keep this under 200 characters'),
  years: z.coerce
    .number()
    .int('Enter a whole number of years')
    .min(0, 'Years cannot be negative')
    .max(60, 'Enter a plausible number of years'),
  location: z.string().trim().min(2, 'Where are you based?').max(120, 'Location is too long'),
})

export type ContactInput = z.infer<typeof contactSchema>
export type CareersInput = z.infer<typeof careersSchema>

/**
 * Two cheap signals, no third-party dependency:
 *  - a hidden field a human never sees and never fills
 *  - a submission that arrived faster than a person could have typed it
 *
 * A missing `elapsedMs` counts as spam: a real submission from our own form
 * always includes it, so its absence means the request did not come from the form.
 */
export function isLikelySpam(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return true

  const record = payload as Record<string, unknown>
  const honeypot = record[HONEYPOT_FIELD]
  if (typeof honeypot === 'string' && honeypot.length > 0) return true

  const elapsed = record.elapsedMs
  if (typeof elapsed !== 'number' || Number.isNaN(elapsed)) return true

  return elapsed < MIN_SUBMIT_MS
}

export function fieldErrorsFrom(error: z.ZodError<Record<string, unknown>>): Record<string, string> {
  const flattened = error.flatten().fieldErrors
  const result: Record<string, string> = {}

  for (const [field, messages] of Object.entries(flattened)) {
    if (messages && messages.length > 0) result[field] = messages[0]
  }

  return result
}
