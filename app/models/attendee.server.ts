/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Attendee, User } from "@prisma/client"

import { prisma } from "../db.server"

export type { Attendee }

export async function getAttendees() {
  return prisma.attendee.findMany()
}

export async function getAttendeesByUserId(userId: User[`id`]) {
  return prisma.attendee.findMany({ where: { userId: userId } })
}

export async function createAttendee(
  attendee: Pick<Attendee, `tripId` | `userId`>,
) {
  return prisma.attendee.create({ data: attendee })
}

export async function updateAttendee(
  tripId: Attendee[`tripId`],
  userId: Attendee[`userId`],
  date: Date,
) {
  return prisma.attendee.update({
    where: {
      tripId_userId: { tripId, userId },
    },
    data: {
      isAccepted: date,
    },
  })
}
