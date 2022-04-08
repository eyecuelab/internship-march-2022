import type { Trip } from "@prisma/client"

import { prisma } from "~/db.server"

export type { Trip }

export async function getTrips(): Promise<Trip[]> {
  return prisma.trip.findMany()
}

// export async function getTripById(id: string) {
//   return prisma.trip.findUnique({ where: { id } })
// }

export async function createTrip(
  trip: Pick<Trip, `nickName` | `ownerId`>,
): Promise<Trip> {
  return prisma.trip.create({ data: trip })
}
/* start notes

export async function getUsersLists(userId: User["id"]): Promise<List[]> {
  return prisma.list.findMany({
    where: {
      OR: [
        {
          owner: {
            id: userId,
          },
        },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
  });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}





{
    data: {
      attendees,
      nickName,
      owner,
      ownerId,
      stops,
      startDate,
      endDate,
      : {
        connect: {
          id: tripId,
        },
      },
    },
  }
  model Trip {
    id String @id @default(cuid())
    ownerId String
    owner   User   @relation(name: "trips", fields: [ownerId], references: [id])
    attendees Attendee[]
    stops Stop[]
    startDate DateTime?
    endDate   DateTime?
    nickName String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  
  export async function createList(
    ownerId: User[`id`],
  name: List[`name`],
  ): Promise<List> {
    return prisma.list.create({
    data: {
      owner: {
        connect: {
          id: ownerId,
        },
      },
      name,
      slug: nanoid(4),
    },
  })
}

end notes */
