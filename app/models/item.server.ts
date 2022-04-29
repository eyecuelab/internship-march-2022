/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Item } from "@prisma/client"

import { TripLiDetail } from "~/styles/styledComponents"

import { prisma } from "../db.server"
export type { Item }

export async function createItem(
  item: Pick<Item, `description` | `tripId` | `userId`>,
) {
  return prisma.item.create({ data: item })
}

export async function getItemById(id: Item[`id`]) {
  return prisma.item.findUnique({ where: { id } })
}

export async function updateChecked(
  id: Item[`id`],
  isChecked: Item[`isChecked`],
) {
  return prisma.item.update({
    where: {
      id,
    },
    data: {
      isChecked,
    },
  })
}
