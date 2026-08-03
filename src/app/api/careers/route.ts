import { NextResponse } from 'next/server'
import { careersSchema, fieldErrorsFrom, isLikelySpam } from '@/lib/schemas'
import { formatCareersEmail, sendMail } from '@/lib/resend'

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, errors: {} }, { status: 400 })
  }

  // Spam gets a 200 with no mail sent. Returning an error would just tell the
  // bot which signal caught it. Log the discarded payload so a false positive
  // (a real applicant) is still recoverable.
  if (isLikelySpam(payload)) {
    console.warn('[careers] discarded as spam', JSON.stringify(payload))
    return NextResponse.json({ ok: true })
  }

  const parsed = careersSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrorsFrom(parsed.error) }, { status: 400 })
  }

  try {
    await sendMail(formatCareersEmail(parsed.data))
  } catch (error) {
    console.error('[careers] failed to send application', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
