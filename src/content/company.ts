/**
 * Single source of truth for every TINWA company fact.
 *
 * Two values here are deliberate decisions recorded in the design spec (§2.1):
 *
 * 1. `address` is the enterprise address from the B-BBEE affidavit, NOT the
 *    CIPC registered office (103 Sun Valley, Karin Avenue, Lambton Gardens,
 *    1401). A client verifying TINWA on the CIPC register will see a different
 *    address.
 * 2. `bbbee.level` is 4, matching the ticked box on the affidavit. The
 *    affidavit's bullets separately declare 100% black ownership, which would
 *    map to level 1. Change this one value once a corrected affidavit exists.
 */
export const company = {
  legalName: 'TINWA (Pty) Ltd',
  shortName: 'TINWA',
  tagline: 'Senior engineers, embedded. Software, delivered.',

  registrationNumber: '2019/154386/07',
  taxNumber: '9371513194',
  registrationDate: '2019-03-26',
  enterpriseType: 'Private Company',
  director: 'Tapiwanashe Shoshore',

  address: {
    line1: '476 Felstead Avenue, Unit 52',
    line2: 'Grand Rapids, Northriding',
    postalCode: '2169',
    city: 'Johannesburg',
    province: 'Gauteng',
    country: 'South Africa',
  },

  phone: '+27 73 309 7462',
  phoneHref: 'tel:+27733097462',
  email: 'hello@tinwa.co.za',
  emailHref: 'mailto:hello@tinwa.co.za',

  domain: 'tinwa.co.za',
  siteUrl: 'https://tinwa.co.za',

  bbbee: {
    status: 'EME',
    level: 4,
    recognition: '100%',
    validUntil: '2027-07-16',
  },
} as const

export function formatAddress(): string[] {
  const { line1, line2, city, province, postalCode, country } = company.address
  return [line1, line2, `${city}, ${province}, ${postalCode}`, country]
}
