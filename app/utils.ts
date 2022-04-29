import { useMemo } from "react"

import { useMatches } from "remix"

import type { User } from "~/models/user.server"

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches()
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  )
  return route?.data
}

function isUser(user: unknown): user is User {
  return (
    Boolean(user) &&
    typeof user === `object` &&
    typeof (user as User).email === `string`
  )
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData(`root`)
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}

export function useUser(): User {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      `No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.`,
    )
  }
  return maybeUser
}

export function validateEmail(email: unknown): email is string {
  return typeof email === `string` && email.length > 3 && email.includes(`@`)
}

export const join = (...args: string[]): string => args.join(` `)

export function formatUrl(url: string): string {
  const searchRegExp = /\s/g
  const replaceWith = `%20`

  return url.replace(searchRegExp, replaceWith)
}
