import type { WebhookEvent } from '@clerk/react-router/ssr.server'
import { prisma } from '@podcast-generator/db/prisma'

type WebhookEventOrganizationMembership = Extract<
  WebhookEvent,
  {
    type:
      | 'organizationMembership.created'
      | 'organizationMembership.updated'
      | 'organizationMembership.deleted'
  }
>

/**
 * 組織メンバー情報の作成・更新
 * @param event
 */
export const organizationMembershipUpsert = async (
  event: WebhookEventOrganizationMembership,
) => {
  const organization = await prisma.organization.findUnique({
    where: { id: event.data.organization.id },
  })
  const user = await prisma.organizationMembership.findUnique({
    where: { id: event.data.public_user_data.user_id },
  })
  if (!organization || !user) {
    console.error('Organization or User not found', event.data)
    throw Response.json(
      { error: 'Organization or User not found' },
      { status: 400 },
    )
  }
  await prisma.organizationMembership.upsert({
    where: {
      id: event.data.id,
    },
    update: {
      organizationId: organization.id,
      userId: user.id,
      role: event.data.role,
      permissions: JSON.stringify(event.data.permissions),
    },
    create: {
      organizationId: organization.id,
      userId: user.id,
      role: event.data.role,
      permissions: JSON.stringify(event.data.permissions),
    },
  })
}

export const organizationMembershipDelete = async (
  event: WebhookEventOrganizationMembership,
) => {
  await prisma.organizationMembership.delete({
    where: { id: event.data.id },
  })
}
