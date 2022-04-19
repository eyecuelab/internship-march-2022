import type { Trip } from "@prisma/client"

import { prisma } from "../db.server"

export type { Trip }

export async function getTrips(): Promise<Trip[]> {
  return prisma.trip.findMany()
}

export async function getTripById(id: Trip[`id`]) {
  return prisma.trip.findUnique({ where: { id } })
}

export async function createTrip(
  trip: Pick<Trip, `nickName` | `ownerId`>,
): Promise<Trip> {
  return prisma.trip.create({ data: trip })
}
