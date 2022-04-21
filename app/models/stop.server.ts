/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Stop, Trip } from "@prisma/client"

import { prisma } from "../db.server"

export type { Stop }

export async function getStopsByTripId(tripId: Trip[`id`]): Promise<Stop[]> {
  return prisma.stop.findMany({ where: { trip: {} } })
}
