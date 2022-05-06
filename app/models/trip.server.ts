/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Trip } from "@prisma/client"

import { prisma } from "../db.server"

export type { Trip }

export async function getTrips() {
  return prisma.trip.findMany()
}

export async function getTripById(id: Trip[`id`]) {
  return prisma.trip.findUnique({
    where: {
      id,
    },
    include: {
      stops: {},
      decider: {},
      attendees: {},
    },
  })
}

export async function createTrip(
  trip: Pick<Trip, `endDate` | `nickName` | `ownerId` | `startDate`>,
) {
  return prisma.trip.create({ data: trip })
}

export async function updateTrip(id: Trip[`id`], deciderId: Trip[`deciderId`]) {
  return prisma.trip.update({
    where: { id },
    data: { deciderId },
  })
}
