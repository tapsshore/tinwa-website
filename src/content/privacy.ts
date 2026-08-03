import { company } from './company'

export const privacyIntro = {
  title: 'Privacy notice',
  updated: '3 August 2026',
  body: `This notice explains how ${company.legalName} collects, uses and retains personal information submitted through this website, in line with the Protection of Personal Information Act, 2013 (POPIA).`,
}

export const privacySections: { heading: string; body: string[] }[] = [
  {
    heading: 'What we collect',
    body: [
      'From the contact form: your name, company name, email address, phone number, the type of enquiry and the message you write.',
      'From the careers form: your name, email address, a link to your LinkedIn profile or CV, your primary technology stack, your years of experience and your location.',
      'We do not accept file uploads, and we do not use advertising or analytics cookies on this site. The only value stored in your browser is your light or dark theme preference.',
    ],
  },
  {
    heading: 'Why we use it',
    body: [
      'Contact form submissions are used solely to respond to your enquiry and, if it leads somewhere, to carry on that conversation.',
      'Careers form submissions are used to assess whether there is a fit for current or upcoming engagements, and to contact you about them.',
      'We do not sell your information, and we do not add you to a mailing list.',
    ],
  },
  {
    heading: 'Who we share it with',
    body: [
      `Submissions are transmitted by Resend, an email delivery provider acting as an operator on our behalf, and delivered to a mailbox controlled by ${company.legalName}.`,
      'This website is hosted by Vercel. Where a submission concerns a specific client engagement, we may share relevant details with that client only with your knowledge.',
    ],
  },
  {
    heading: 'How long we retain it',
    body: [
      'Enquiries are retained for up to 24 months from your last contact with us, so we can pick up a conversation where it left off.',
      'Applications are retained for up to 24 months so we can come back to you when a suitable engagement appears. Tell us at any time if you would rather we did not.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      `You may ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. Email ${company.email} and we will action the request.`,
      'If you are not satisfied with how we have handled your information, you may lodge a complaint with the Information Regulator of South Africa.',
    ],
  },
  {
    heading: 'Contacting us',
    body: [
      `${company.legalName}, registration ${company.registrationNumber}.`,
      `Email ${company.email} or call ${company.phone}.`,
    ],
  },
]
