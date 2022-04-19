import type { Attendee, User, Trip } from "@prisma/client"

import { prisma } from "../db.server"

export type { Attendee }

export async function getAttendeesByTripId(tripId: Trip[`id`]) { 
  return prisma.attendee.findMany({ 
    where: { 
      tripId: tripId 
    },
    include: {
      user: {},
      expenses: {}
    } 
  })
}

export async function getAttendeesByUserId(userId: User['id']): Promise<Attendee[]> {
  return prisma.attendee.findMany({ where: { userId: userId } })
}

export async function createAttendee(
  attendee: Pick<Attendee, `tripId` | `userId`>,
): Promise<Attendee> {
  return prisma.attendee.create({ data: attendee })
}