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

const validateIndex = async (stop: Pick<Stop, `id` | `index` | `tripId`>) => {
  const stopDB = await getStopById(stop.id)
  invariant(stopDB, `not a valid stop`)
  const stopToUpdate = await prisma.stop.findFirst({
    where: {
      index: {
        equals: stop.index,
      },
      id: {
        not: stopDB.id,
      },
    },
  })
  if (stopToUpdate) {
    stopDB.index > stop.index ? stopToUpdate.index++ : stopToUpdate.index--
    await updateStop(stopToUpdate, true)
  }
  // 1&2 were the same id, 3 had same index but diff id, TEST PASS
}

export async function updateStop(
  stop: Pick<Stop, `apiResult` | `id` | `index` | `tripId`>,
  isLoop = false,
) {
  if (!isLoop) {
    await validateIndex(stop)
  }
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
