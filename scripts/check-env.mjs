const required = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'NEXT_PUBLIC_SITE_URL']
const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

console.log('All required environment variables are present.')
