/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Stop, Trip } from "@prisma/client"

import { prisma } from "../db.server"

export type { Stop }

export async function getStopsByTripId(tripId: Trip[`id`]) {
  return prisma.stop.findMany({ where: { tripId } })
}
export async function createStop(
  stop: Pick<Stop, `apiResult` | `index` | `tripId`>,
) {
  await validateIndex(stop)
  return prisma.stop.create({ data: stop })
}

const validateIndex = async (
  stop: Pick<Stop, `apiResult` | `index` | `tripId`>,
) => {
  const tripStops = await getStopsByTripId(stop.tripId)
  return await tripStops.map(async (s) => {
    if (s.index >= stop.index) {
      s.index++
      await updateStop(s)
    }
  })
}

export async function updateStop(
  stop: Pick<Stop, `apiResult` | `id` | `index` | `tripId`>,
) {
  return prisma.stop.update({
    where: {
      id: stop.id,
    },
    data: {
      apiResult: stop.apiResult,
      index: stop.index,
      tripId: stop.tripId,
    },
  })
}
