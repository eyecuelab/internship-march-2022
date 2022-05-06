/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Stop, Trip } from "@prisma/client"
import invariant from "tiny-invariant"

import { prisma } from "../db.server"

export type { Stop }

export async function getStopById(id: Stop[`id`]) {
  return prisma.stop.findFirst({ where: { id } })
}
export async function getStopsByTripId(tripId: Trip[`id`]) {
  return prisma.stop.findMany({ where: { tripId } })
}
export async function createStop(
  stop: Pick<Stop, `apiResult` | `index` | `tripId`>,
) {
  return prisma.stop.create({ data: stop })
}
//STILL NEEDS TO TEST. WIP
const validateIndex = async (stop: Pick<Stop, `id` | `index` | `tripId`>) => {
  const tripStops = await getStopsByTripId(stop.tripId)
  const stopInDb = await getStopById(stop.id)
  invariant(stopInDb, `not a valid stop`)
  prisma.stop.findFirst({
    where: {
      index: {
        equals: stop.index,
      },
      id: {
        not: stopInDb.id,
      },
    },
  })
  return tripStops
}
/*
  Have: If a stop is deleted all stops with a higher index subtract by 1

  Need: If a stop is moved down 1 index I need the stop that is at that current index
  to move up 1
  If a stop is moved up 1 index I need the stop that is at that current index to move down 1
*/
export async function updateStop(
  stop: Pick<Stop, `apiResult` | `id` | `index` | `tripId`>,
) {
  await validateIndex(stop)
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
