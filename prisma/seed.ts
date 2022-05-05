/* eslint-disable max-lines */
import { PrismaClient } from "@prisma/client"
import type {
  Trip,
  User,
  Attendee,
  Decider,
  Expense,
  Item,
} from "@prisma/client"
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
        create: { hash: hashedPassword },
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
          avatarUrl: user.avatarUrl,
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
    getDecider().map((decider) => {
      return prisma.decider.create({ data: decider })
    }),
  )
  await Promise.all(
    getExpenses().map((expense) => {
      return prisma.expense.create({ data: expense })
    }),
  )
  await Promise.all(
    getItems().map((item) => {
      return prisma.item.create({ data: item })
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
      avatarUrl: `https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `cl1ihz4wr02309c1dbp8gi835`,
      email: `ella@test`,
      userName: `two`,
      avatarUrl: `https://images.unsplash.com/photo-1497329440692-92a8710c8f18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDB8fGdvb2Z5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=700&q=60`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `cl1xvbab00028qz1d1e0u5h63`,
      email: `jeff@test`,
      userName: `three`,
      avatarUrl: `https://images.unsplash.com/photo-1529466924508-a1761f426c75?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
    {
      id: `cl1xwwtyf0007jj1dl1yiycqb`,
      email: `jacob@test`,
      userName: `three`,
      avatarUrl: `https://images.unsplash.com/photo-1540968221243-29f5d70540bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80`,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
  ]
}
const getTrips = (): Trip[] => {
  return [
    {
      id: `cl1xvci7b0050qz1d3o01tyg1`,
      deciderId: `cl2pcwfus01059ooyle0i7l1r`,
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
      deciderId: `cl2pcviv900719ooyfr13urm4`,
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
      deciderId: `cl2pcvepo00489ooy1y7176bb`,
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
      deciderId: `cl2pcur0g00199ooynzsn6q5f`,
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
      //kim@test
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
      //kim on ellas
      tripId: `cl1xvd63a0068qz1dbhh557su`,
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
      //ella@test
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
      //ella on jeffs
      tripId: `cl1xvdwqy0085qz1dfy8rscc9`,
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
      //jeff@test
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
      //jeff on jacobs
      tripId: `cl1xwxl5a0024jj1d78omqrta`,
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
      //jacob@test
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
    {
      //jacob on kims trip
      tripId: `cl1xvci7b0050qz1d3o01tyg1`,
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
const getDecider = (): Pick<Decider, `id` | `tripId`>[] => {
  return [
    { id: `cl2pcwfus01059ooyle0i7l1r`, tripId: `cl1xvci7b0050qz1d3o01tyg1` },
    { id: `cl2pcviv900719ooyfr13urm4`, tripId: `cl1xvd63a0068qz1dbhh557su` },
    { id: `cl2pcvepo00489ooy1y7176bb`, tripId: `cl1xvdwqy0085qz1dfy8rscc9` },
    { id: `cl2pcur0g00199ooynzsn6q5f`, tripId: `cl1xwxl5a0024jj1d78omqrta` },
  ]
}

const getExpenses = (): Expense[] => {
  return [
    {
      //kim expense
      id: `cl212bmtb0009fv1d26ntsf0z`,
      description: `gas`,
      total: 45,
      createdAt: new Date(`2022-04-15T23:29:38.879Z`),
      updatedAt: new Date(`2022-04-15T23:29:38.879Z`),
      tripId: `cl1xvci7b0050qz1d3o01tyg1`,
      userId: `cl1xv8xul0010qz1dmv2l3jqy`,
    },
    {
      //kim expense
      id: `cl1ihmh8h00049c1dd4miflku`,
      description: `french fries`,
      total: 5,
      createdAt: new Date(`2022-04-15T23:29:39.879Z`),
      updatedAt: new Date(`2022-04-15T23:29:39.879Z`),
      tripId: `cl1xvci7b0050qz1d3o01tyg1`,
      userId: `cl1xv8xul0010qz1dmv2l3jqy`,
    },
    {
      //ella expense
      id: `cl21b59db0027fv1dbafvnnfp`,
      description: `Black Bear Diner`,
      total: 56,
      createdAt: new Date(`2022-04-16T03:36:38.062Z`),
      updatedAt: new Date(`2022-04-16T03:36:38.064Z`),
      tripId: `cl1xvd63a0068qz1dbhh557su`,
      userId: `cl1ihz4wr02309c1dbp8gi835`,
    },
    {
      //ella expense
      id: `cl21b7n0k0044fv1dw95febkn`,
      description: `Super 8`,
      total: 89,
      createdAt: new Date(`2022-04-16T03:38:29.059Z`),
      updatedAt: new Date(`2022-04-16T03:38:29.060Z`),
      tripId: `cl1xvd63a0068qz1dbhh557su`,
      userId: `cl1ihz4wr02309c1dbp8gi835`,
    },
    {
      //jeff expense
      id: `cl21btcg80061fv1db2hhq2wo`,
      description: `Campsite`,
      total: 56,
      createdAt: new Date(`2022-04-16T03:38:29.060Z`),
      updatedAt: new Date(`2022-04-16T03:38:29.062Z`),
      tripId: `cl1xvdwqy0085qz1dfy8rscc9`,
      userId: `cl1xvbab00028qz1d1e0u5h63`,
    },
    {
      id: `cl21dpxa00135fv1d3nrsdq1m`,
      description: `breakfast`,
      total: 36,
      createdAt: new Date(`2022-04-16T03:38:29.063Z`),
      updatedAt: new Date(`2022-04-16T03:38:29.064Z`),
      tripId: `cl1xvdwqy0085qz1dfy8rscc9`,
      userId: `cl1xvbab00028qz1d1e0u5h63`,
    },
    {
      //jacob expense
      id: `cl21dipg80101fv1dlrfbjhm8`,
      description: `Museum Entry`,
      total: 100,
      createdAt: new Date(`2022-04-16T03:38:29.064Z`),
      updatedAt: new Date(`2022-04-16T03:38:29.066Z`),
      tripId: `cl1xwxl5a0024jj1d78omqrta`,
      userId: `cl1xwwtyf0007jj1dl1yiycqb`,
    },
    {
      //jacob expense
      id: `cl21dknqf0118fv1dyot6gb3e`,
      description: `Dinner`,
      total: 72,
      createdAt: new Date(`2022-04-16T03:38:29.067Z`),
      updatedAt: new Date(`2022-04-16T03:38:29.068Z`),
      tripId: `cl1xwxl5a0024jj1d78omqrta`,
      userId: `cl1xwwtyf0007jj1dl1yiycqb`,
    },
  ]
}
const getItems = (): Item[] => {
  return [
    {
      id: `cl1xvdwqy0046qz1dfy8rfcc7`,
      description: `Camping Stove`,
      tripId: `cl1xvd63a0068qz1dbhh557su`, //testTrip21
      userId: `cl1ihz4wr02309c1dbp8gi835`, //ella@test
      isChecked: true,
      createdAt: new Date(
        `Tue Sep 25 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 26 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      id: `cl1xvdwqy0089qz1dfy8rqcc6`,
      description: `Beach Towel`,
      tripId: `cl1xvd63a0068qz1dbhh557su`, //testTrip2
      userId: `cl1ihz4wr02309c1dbp8gi835`, //ella@test
      isChecked: false,
      createdAt: new Date(
        `Tue Sep 25 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 26 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
    },
    {
      id: `cl1xvdwqy0077qz1dfy8rxcc5`,
      description: `Propane`,
      tripId: `cl1xvd63a0068qz1dbhh557su`, //testTrip2
      userId: `cl1ihz4wr02309c1dbp8gi835`, //ella@test
      isChecked: true,
      createdAt: new Date(
        `Tue Sep 25 2021 16:16:50 GMT-0400 (Eastern Daylight Time)`,
      ),
      updatedAt: new Date(
        `Tue Sep 26 2021 16:17:00 GMT-0400 (Eastern Daylight Time)`,
      ),
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
