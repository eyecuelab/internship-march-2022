/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Trip } from "@prisma/client"

import { prisma } from "../db.server"

export type { Trip }

export async function getTrips(): Promise<Trip[]> {
  return prisma.trip.findMany()
}

export async function getTripById(id: Trip[`id`]) {
  return prisma.trip.findUnique({
    where: {
      id,
    },
    include: {
      stops: true,
      attendees: true,
    },
  })
}
// tripId, attendees,start and end dates, start and end location, stops[]
export async function createTrip(
  trip: Pick<Trip, `nickName` | `ownerId`>,
): Promise<Trip> {
  return prisma.trip.create({ data: trip })
}
