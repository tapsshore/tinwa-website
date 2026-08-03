import type { MetadataRoute } from 'next'
import { routes } from '@/content/nav'
import { company } from '@/content/company'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? company.siteUrl

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: route === '/' ? baseUrl : `${baseUrl}${route}`,
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.7,
  }))
}
