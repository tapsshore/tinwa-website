export type LogoAsset = { src: string; width: number; height: number }

/**
 * Maps an ExperienceEntry slug to a logo asset in /public/logos.
 *
 * Entries are added only for companies with a public brand or press kit whose
 * terms permit this use. Any slug absent from this map renders as a text chip
 * instead — that fallback is the intended state, not a missing asset. Adding a
 * logo is a data change here plus a file in /public/logos; no component changes.
 */
export const logoManifest: Record<string, LogoAsset> = {}
