import React from 'react'
import { Link, useMatches, type UIMatch } from 'react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui'

function isBreadcrumbMatch<Data>(match?: UIMatch<Data>): match is UIMatch<
  Data,
  {
    breadcrumbs: (data: unknown) => string
    to?: string
  }
> {
  if (!match) return false
  if (typeof match.handle !== 'object') return false
  if (match.handle === null) return false
  if (!('breadcrumbs' in match.handle)) return false
  if (typeof match.handle.breadcrumbs === 'function') return true
  return false
}

export const useBreadcrumbs = () => {
  const breadcrumbs = useMatches()
    .filter((match) => isBreadcrumbMatch(match))
    .map((match) => ({
      id: match.id,
      breadcrumbs: match.handle.breadcrumbs(match.data),
      to: match.handle.to,
    }))

  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb) => (
          <React.Fragment key={breadcrumb.id}>
            <BreadcrumbItem key={breadcrumb.id}>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={breadcrumb.to || ''}>{breadcrumb.breadcrumbs}</Link>
            </BreadcrumbLink>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
