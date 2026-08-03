import { Resend } from 'resend'
import { serverEnv } from './env'
import { company } from '@/content/company'
import type { CareersInput, ContactInput } from './schemas'

export type MailMessage = { subject: string; replyTo: string; text: string }

const ENQUIRY_LABELS: Record<ContactInput['enquiryType'], string> = {
  hire: 'Hire a developer',
  project: 'Start a project',
  other: 'Other',
}

export function formatContactEmail(input: ContactInput): MailMessage {
  return {
    subject: `[${company.shortName}] ${ENQUIRY_LABELS[input.enquiryType]} — ${input.name}`,
    replyTo: input.email,
    text: [
      `Enquiry type: ${ENQUIRY_LABELS[input.enquiryType]}`,
      `Name: ${input.name}`,
      `Company: ${input.company ?? '—'}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone ?? '—'}`,
      '',
      input.message,
    ].join('\n'),
  }
}

export function formatCareersEmail(input: CareersInput): MailMessage {
  return {
    subject: `[${company.shortName}] Application — ${input.name} (${input.years} yrs)`,
    replyTo: input.email,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Profile / CV: ${input.profileUrl}`,
      `Primary stack: ${input.primaryStack}`,
      `Years of experience: ${input.years}`,
      `Location: ${input.location}`,
    ].join('\n'),
  }
}

export async function sendMail(message: MailMessage): Promise<void> {
  const env = serverEnv()
  const resend = new Resend(env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: `${company.shortName} website <website@${company.domain}>`,
    to: env.CONTACT_TO_EMAIL,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
  })

  if (error) {
    throw new Error(`Resend rejected the message: ${error.message}`)
  }
}
