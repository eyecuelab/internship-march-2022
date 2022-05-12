import { useMemo } from "react"

import { useMatches } from "remix"

import type { Stop, Trip, Decider, Attendee } from "@prisma/client"

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
export type FullTrip = Trip & {
  stops: Stop[]
  decider: Decider | null
  attendees: Attendee[]
}
type FormattedGeometry = {
  location: google.maps.LatLng
  viewport: Record<string, Record<string, number>>
}
type FormattedApiResult = {
  geometry: FormattedGeometry
  formatted_address: string
  icon: string
  name: string
  place_id: string
  rating: number
  user_ratings_total: number
}

export type FormattedStop = {
  id: string
  tripId: string
  apiResult: FormattedApiResult
  index: number
  createdAt: Date
  updatedAt: Date
}

export type TripWithFormattedStops = Trip & { stops: FormattedStop[] }

export function formatStops(stops: Stop[]): FormattedStop[] {
  const fstops: FormattedStop[] = []
  stops.map((s) => {
    const { id, tripId, apiResult, index, createdAt, updatedAt } = s
    const fs: FormattedStop = {
      id,
      tripId,
      apiResult: apiResult ? JSON.parse(apiResult) : apiResult,
      index,
      createdAt,
      updatedAt,
    }
    fstops.push(fs)
  })
  return fstops
}
export function formatTrip(trip: FullTrip): TripWithFormattedStops {
  const fs = formatStops(trip.stops)
  const { stops, ...rest } = trip
  const newTrip: TripWithFormattedStops = { stops: fs, ...rest }
  return newTrip
}
export const findCenter = (pos1: number, pos2: number): number => {
  return (pos1 + pos2) / 2
}
export const findDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  return Math.hypot(x2 - x1, y2 - y1)
}

export const MAX_FORM_LENGTH = 22
