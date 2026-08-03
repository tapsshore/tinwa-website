import { z } from 'zod'

const schema = z.object({
  RESEND_API_KEY: z.string().min(1),
  CONTACT_TO_EMAIL: z.email(),
  NEXT_PUBLIC_SITE_URL: z.url(),
})

export type ServerEnv = z.infer<typeof schema>

let cached: ServerEnv | null = null

/**
 * Validates the server environment on first call.
 *
 * Route handlers import this at module scope, so a misconfigured deploy fails
 * loudly on the first request with a message naming the offending variable,
 * and the form renders its fallback contact details. `npm run check:env` runs
 * the same requirement in CI before a deploy can happen at all.
 */
export function serverEnv(): ServerEnv {
  if (cached) return cached

  const parsed = schema.safeParse(process.env)

  if (!parsed.success) {
    const names = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
    throw new Error(
      `Invalid or missing environment variables: ${names.join(', ')}. ` +
        `Set them in .env.local for local development, and in the Vercel project settings for deploys.`,
    )
  }

  cached = parsed.data
  return cached
}
