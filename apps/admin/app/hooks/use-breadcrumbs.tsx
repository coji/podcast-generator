import React from 'react'
import { useMatches, type Params, type UIMatch } from 'react-router'
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
    breadcrumbs: ({
      loaderData,
      params,
    }: {
      loaderData: Data
      params: Params
    }) => React.ReactNode
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
      breadcrumbs: match.handle.breadcrumbs({
        loaderData: match.data,
        params: match.params,
      }),
    }))

  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb) => (
          <React.Fragment key={breadcrumb.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={breadcrumb.id}>
              <BreadcrumbLink asChild>{breadcrumb.breadcrumbs}</BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
