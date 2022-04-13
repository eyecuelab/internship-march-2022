import type { Attendee } from "@prisma/client"

import { prisma } from "../db.server"

export type { Attendee }

export async function getAttendees(): Promise<Attendee[]> {
  return prisma.attendee.findMany()
}

// export async function getTripById(id: string) {
//   return prisma.trip.findUnique({ where: { id } })
// }

export async function createAttendee(
  attendee: Pick<Attendee, `tripId` | `userId`>,
): Promise<Attendee> {
  return prisma.attendee.create({ data: attendee })
}

// model Attendee {
//   tripId   *     String
//   trip          Trip      @relation(fields: [tripId], references: [id], onDelete: Cascade, onUpdate: Cascade)
//   userId      *  String
//   user          User      @relation(name: "attendee", fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade) // user ID is for this owner field, id is referencing user id
//   expenses      Expense[]
//   packingList   Item[]
//   isAccepted    DateTime?
//   createdAt     DateTime  @default(now())
//   updatedAt     DateTime  @updatedAt

//   @@id([tripId, userId])
// }
