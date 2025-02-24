import type { WebhookEvent } from '@clerk/react-router/ssr.server'
import { prisma } from '@podcast-generator/db/prisma'

type WebhookEventOrganizationCreateOrUpdate = Extract<
  WebhookEvent,
  { type: 'organization.created' | 'organization.updated' }
>
type WebhookEventUserDeleted = Extract<
  WebhookEvent,
  { type: 'organization.deleted' }
>

/**
 * 組織の追加・更新
 * @param event
 * @returns
 */
export const organizationUpsert = async (
  event: WebhookEventOrganizationCreateOrUpdate,
) => {
  // Tenant 追加/更新
  return await prisma.organization.upsert({
    where: { id: event.data.id },
    update: {
      id: event.data.id,
      name: event.data.name,
      slug: event.data.slug,
    },
    create: {
      id: event.data.id,
      name: event.data.name,
      slug: event.data.slug,
    },
  })
}

export const organizationDelete = async (event: WebhookEventUserDeleted) => {
  if (!event.data.id) {
    console.error('No id found in event data', event.data)
    throw Response.json({ error: 'No id found in event data' }, { status: 400 })
  }
  return await prisma.organization.delete({ where: { id: event.data.id } })
}
