import { PrismaClient } from "@prisma/client"
import type { Trip, User, Attendee, Password } from "@prisma/client"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()

async function seed() {
  const email = `rachel@remix.run`

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = await bcrypt.hash(`rachelIsCool`, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  })

  await Promise.all(
    getTrips().map((trip) => {
      return prisma.trip.create({ data: trip })
    }),
  )

  await Promise.all(
    getUsers().map((user) => {
      return prisma.user.create({ data: user })
    }),
  )
  await Promise.all(
    getAttendees().map((attendee) => {
      return prisma.attendee.create({ data: attendee })
    }),
  )

  console.log(`Database has been seeded. 🌱`)
}

const getTrips = (): Trip[] => {
  return [
    {
      id: `1`,
      ownerId: `1`,
      startDate: null,
      endDate: null,
      nickName: `testTrip1`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `2`,
      ownerId: `2`,
      startDate: null,
      endDate: null,
      nickName: `testTrip2`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `3`,
      ownerId: `3`,
      startDate: null,
      endDate: null,
      nickName: `testTrip3`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
  ]
}

const getUsers = (): User[] => {
  return [
    {
      id: `1`,
      email: `testEmail1`,
      userName: `one`,
      avatarUrl: `testurlone`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `2`,
      email: `testEmail2`,
      userName: `two`,
      avatarUrl: `testurltwo`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `3`,
      email: `testEmail3`,
      userName: `three`,
      avatarUrl: `testurlthree`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
  ]
}
const getAttendees = (): Attendee[] => {
  return [
    {
      tripId: `1`,
      userId: `1`,
      deciderId: `1`,
      packingListId: `1`,
      isAccepted: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      tripId: `2`,
      userId: `2`,
      deciderId: `2`,
      packingListId: `2`,
      isAccepted: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      tripId: `3`,
      userId: `3`,
      deciderId: `3`,
      packingListId: `3`,
      isAccepted: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
  ]
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
