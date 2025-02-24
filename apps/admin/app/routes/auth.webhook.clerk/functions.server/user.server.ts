import type { WebhookEvent } from '@clerk/react-router/ssr.server'
import { prisma } from '@podcast-generator/db/prisma'

type WebhookEventUserCreateOrUpdate = Extract<
  WebhookEvent,
  { type: 'user.created' | 'user.updated' }
>
type WebhookEventUserDeleted = Extract<WebhookEvent, { type: 'user.deleted' }>

/**
 * AdminUser 追加/更新
 * @param event Clerk Webhook Event
 */
export const userUpsert = async (event: WebhookEventUserCreateOrUpdate) => {
  return await prisma.user.upsert({
    where: { id: event.data.id },
    update: {
      email: event.data.email_addresses[0].email_address,
      name: event.data.username ?? 'no name',
    },
    create: {
      id: event.data.id,
      email: event.data.email_addresses[0].email_address,
      name: event.data.username ?? 'no name',
    },
  })
}

/**
 * AdminUser 削除
 */

export const userDelete = async (event: WebhookEventUserDeleted) => {
  // AdminUser 削除
  if (!event.data.id) {
    console.error('No id found in event data', event.data)
    throw Response.json({ error: 'No id found in event data' }, { status: 400 })
  }
  return await prisma.user.delete({ where: { id: event.data.id } })
}
