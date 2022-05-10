/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Trip } from "@prisma/client"
import { Prisma } from "@prisma/client"

import { prisma } from "../db.server"

export type { Trip }

export async function getTrips(): Promise<Trip[]> {
  return prisma.trip.findMany()
}

const tripWithRelations = Prisma.validator<Prisma.TripArgs>()({
  include: { stops: true, decider: true, attendees: true },
})

type TripWithRelations = Prisma.TripGetPayload<typeof tripWithRelations>

export async function getTripById(
  id: Trip[`id`],
): Promise<TripWithRelations | null> {
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

export async function createTrip(trip: Prisma.TripCreateInput): Promise<Trip> {
  return prisma.trip.create({ data: trip })
}

export async function updateTrip(
  id: Trip[`id`],
  deciderId: Trip[`deciderId`],
): Promise<Trip> {
  return prisma.trip.update({
    where: { id },
    data: { deciderId },
  })
}

export async function updateTripDates(
  id: Trip[`id`],
  startDate: Trip[`startDate`],
  endDate: Trip[`endDate`],
) {
  return prisma.trip.update({
    where: { id },
    data: { startDate, endDate },
  })
}

export async function deleteTrip(id: Trip[`id`]) {
  return prisma.trip.delete({
    where: { id },
  })
}
