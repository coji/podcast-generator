import type { ActionFunctionArgs } from 'react-router'
import { match } from 'ts-pattern'
import {
  organizationDelete,
  organizationMembershipDelete,
  organizationMembershipUpsert,
  organizationUpsert,
  userDelete,
  userUpsert,
  verifyClerkWebhookOrThrow,
} from './functions.server/index.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const event = await verifyClerkWebhookOrThrow(request)
  match(event)
    .with({ type: 'user.created' }, (e) => userUpsert(e))
    .with({ type: 'user.updated' }, (e) => userUpsert(e))
    .with({ type: 'user.deleted' }, (e) => userDelete(e))
    .with({ type: 'organization.created' }, (e) => organizationUpsert(e))
    .with({ type: 'organization.updated' }, (e) => organizationUpsert(e))
    .with({ type: 'organization.deleted' }, (e) => organizationDelete(e))
    .with({ type: 'organizationMembership.created' }, (e) =>
      organizationMembershipUpsert(e),
    )
    .with({ type: 'organizationMembership.updated' }, (e) =>
      organizationMembershipUpsert(e),
    )
    .with({ type: 'organizationMembership.deleted' }, (e) =>
      organizationMembershipDelete(e),
    )
    .otherwise((e) => {
      throw new Error(`Unhandled webhook event: ${event.type}`)
    })

  return Response.json({})
}
