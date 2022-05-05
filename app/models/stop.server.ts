/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Stop, Trip } from "@prisma/client"
import invariant from "tiny-invariant"

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

export async function updateStopIndex(id: Stop[`id`], tripId: Stop[`tripId`]) {
  const stop = await prisma.stop.findFirst({
    where: {
      id,
    },
  })
  invariant(stop, `did not find a valid stop`)
  const stopsToUpdate = await prisma.stop.findMany({
    where: {
      tripId,
      index: {
        gt: stop.index,
      },
    },
  })
  stopsToUpdate.map(async (s) => {
    return await prisma.stop.update({
      where: {
        id: s.id,
      },
      data: {
        index: s.index - 1,
      },
    })
  })
  return stopsToUpdate
}

export async function deleteStopById(id: Stop[`id`], tripId: Stop[`tripId`]) {
  await updateStopIndex(id, tripId)
  return prisma.stop.delete({
    where: {
      id,
    },
  })
}
