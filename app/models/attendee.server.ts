import type { Attendee } from "@prisma/client"

import { prisma } from "../db.server"

export type { Attendee }

export async function getAttendees(): Promise<Attendee[]> {
  return prisma.attendee.findMany()
}

export async function createAttendee(
  attendee: Pick<Attendee, `tripId` | `userId`>,
): Promise<Attendee> {
  return prisma.attendee.create({ data: attendee })
}