/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Attendee, User, Trip, Stop, Decider } from "@prisma/client"

import type { FullTrip } from "~/utils"

import { prisma } from "../db.server"
import { getTripById } from "./trip.server"

export type { Attendee }

export async function getAttendees() {
  return prisma.attendee.findMany()
}

export async function getAttendeesByUserId(userId: User[`id`]) {
  return prisma.attendee.findMany({ where: { userId: userId } })
}

export async function getAttendeesByTripId(tripId: Trip[`id`]) {
  return prisma.attendee.findMany({
    where: {
      tripId: tripId,
    },
    include: {
      user: {},
      expenses: {},
      packingList: {},
      trip: {},
    },
  })
}

export async function getAttendeeNames(tripId: Trip[`id`]) {
  return prisma.attendee.findMany({
    where: {
      tripId: tripId,
    },
    include: {
      user: {},
    },
  })
}

export async function getAttendeeById(
  tripId: Attendee[`tripId`],
  userId: Attendee[`userId`],
) {
  return prisma.attendee.findFirst({
    where: {
      tripId: tripId,
      userId: userId,
    },
    include: {
      user: {},
      expenses: {},
      packingList: {},
      trip: {},
    },
  })
}
export async function createAttendee(
  attendee: Pick<Attendee, `tripId` | `userId`>,
) {
  return prisma.attendee.create({ data: attendee })
}
export async function updateAttendee(
  tripId: Attendee[`tripId`],
  userId: Attendee[`userId`],
  date: Date,
) {
  return prisma.attendee.update({
    where: {
      tripId_userId: { tripId, userId },
    },
    data: {
      isAccepted: date,
    },
  })
}
export async function deleteAttendee(
  tripId: Attendee[`tripId`],
  userId: Attendee[`userId`],
) {
  return prisma.attendee.delete({
    where: {
      tripId_userId: { tripId, userId },
    },
  })
}
type NullFreeAttendee = {
  tripId: string
  userId: string
  isAccepted: Date
  createdAt: Date
  updatedAt: Date
}
export async function getUpcomingTripByUserId(userId: Attendee[`userId`]) {
  const attendeeOn = await getAttendeesByUserId(userId)
  const trips: FullTrip[] = []
  await Promise.all(
    attendeeOn.map(async (attendee) => {
      const trip = await getTripById(attendee.tripId)
      if (trip) {
        trips.push(trip)
      }
    }),
  )
  const nextTrip = trips.find((t) => {
    if (t.startDate) {
      if (t.startDate > new Date()) {
        return t
      }
    }
  })
  const acceptedTrips: NullFreeAttendee[] = []
  attendeeOn.map((a) => {
    if (a.isAccepted !== null) {
      const b: NullFreeAttendee = {
        tripId: a.tripId,
        userId: a.userId,
        isAccepted: a.isAccepted,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }
      acceptedTrips.push(b)
    }
  })
  const recentTime = Math.max(
    ...acceptedTrips.map((a) => a.isAccepted.getTime()),
  )
  const recentTrip = acceptedTrips.find(
    (t) => t.isAccepted.getTime() === recentTime,
  )
  return nextTrip
    ? nextTrip
    : typeof recentTrip !== `undefined`
    ? await getTripById(recentTrip.tripId)
    : null
}
