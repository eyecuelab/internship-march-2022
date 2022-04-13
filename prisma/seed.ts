import { PrismaClient } from "@prisma/client"
import type { Trip, User, Attendee, Decider } from "@prisma/client"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()

async function seed() {
  const email = `rachel@remix.run`

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist ye
  })
  const hashedPassword = await bcrypt.hash(`rachelIsCool`, 10)
  const testingPassword = await bcrypt.hash(`testtest`, 10)

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
    getUsers().map((user) => {
      return prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: {
            create: {
              hash: testingPassword,
            },
          },
          userName: user.userName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    }),
  )
  await Promise.all(
    getTrips().map((trip) => {
      return prisma.trip.create({ data: trip })
    }),
  )
  await Promise.all(
    getAttendees().map((attendee) => {
      return prisma.attendee.create({ data: attendee })
    }),
  )
  await Promise.all(
    getDeciders().map((decider) => {
      return prisma.decider.create({ data: decider })
    }),
  )

  console.log(`Database has been seeded. 🌱`)
}

const getUsers = (): User[] => {
  return [
    {
      id: `cl1xv8xul0010qz1dmv2l3jqy`,
      email: `kim@test`,
      userName: `one`,
      avatarUrl: `testurlone`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `cl1ihz4wr02309c1dbp8gi835`,
      email: `ella@test`,
      userName: `two`,
      avatarUrl: `testurltwo`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `cl1xvbab00028qz1d1e0u5h63`,
      email: `jeff@test`,
      userName: `three`,
      avatarUrl: `testurlthree`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `cl1xwwtyf0007jj1dl1yiycqb`,
      email: `jacob@test`,
      userName: `three`,
      avatarUrl: `testurlthree`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
  ]
}
const getTrips = (): Trip[] => {
  return [
    {
      id: `cl1xvci7b0050qz1d3o01tyg1`,
      ownerId: `cl1xv8xul0010qz1dmv2l3jqy`,
      startDate: null,
      endDate: null,
      nickName: `testTrip1`,
      createdAt: new Date(
        `Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 21 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      id: `cl1xvd63a0068qz1dbhh557su`,
      ownerId: `cl1ihz4wr02309c1dbp8gi835`,
      startDate: null,
      endDate: null,
      nickName: `testTrip2`,
      createdAt: new Date(
        `Tue Sep 22 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 22 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      id: `cl1xvdwqy0085qz1dfy8rscc9`,
      ownerId: `cl1xvbab00028qz1d1e0u5h63`,
      startDate: null,
      endDate: null,
      nickName: `testTrip3`,
      createdAt: new Date(
        `Tue Sep 23 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 23 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      id: `cl1xwxl5a0024jj1d78omqrta`,
      ownerId: `cl1xwwtyf0007jj1dl1yiycqb`,
      startDate: null,
      endDate: null,
      nickName: `testTrip4`,
      createdAt: new Date(
        `Tue Sep 23 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 23 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
  ]
}

const getAttendees = (): Attendee[] => {
  return [
    {
      tripId: `cl1xvci7b0050qz1d3o01tyg1`,
      userId: `cl1xv8xul0010qz1dmv2l3jqy`,
      isAccepted: null,
      createdAt: new Date(
        `Tue Sep 21 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 21 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      tripId: `cl1xvd63a0068qz1dbhh557su`,
      userId: `cl1ihz4wr02309c1dbp8gi835`,
      isAccepted: null,
      createdAt: new Date(
        `Tue Sep 22 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 22 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      tripId: `cl1xvdwqy0085qz1dfy8rscc9`,
      userId: `cl1xvbab00028qz1d1e0u5h63`,
      isAccepted: null,
      createdAt: new Date(
        `Tue Sep 23 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 23 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      tripId: `cl1xwxl5a0024jj1d78omqrta`,
      userId: `cl1xwwtyf0007jj1dl1yiycqb`,
      isAccepted: null,
      createdAt: new Date(
        `Tue Sep 24 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 24 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
  ]
}
const getDeciders = (): Pick<Decider, `tripId`>[] => {
  return [
    {
      tripId: `cl1xvci7b0050qz1d3o01tyg1`,
    },
    {
      tripId: `cl1xvd63a0068qz1dbhh557su`,
    },
    {
      tripId: `cl1xvdwqy0085qz1dfy8rscc9`,
    },
    {
      tripId: `cl1xwxl5a0024jj1d78omqrta`,
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
