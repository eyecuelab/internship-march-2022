/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Password, User } from "@prisma/client"
import bcrypt from "bcryptjs"
import { data } from "msw/lib/types/context"

import { prisma } from "../db.server"
import { Trip } from "./trip.server"

export type { User } from "@prisma/client"

export async function getUsers(): Promise<User[]> {
  return prisma.user.findMany()
}

export async function getUserById(id: User[`id`]): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
    include: { trips: true, attendees: true },
  })
}

export async function getUserByEmail(
  email: User[`email`],
): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } })
}

export async function updateUserById(
  id: User[`id`],
  email: User[`email`],
  userName: User[`userName`],
): Promise<User | null> {
  return prisma.user.update({
    where: { id },
    data: {
      email: email,
      userName: userName,
    },
  })
}
// export async function updateUserById(
//   id: User[`id`],
//   email: User[`email`],
//   userName: User[`userName`],
// ): Promise<User | null> {
//   return prisma.user.update({
//     where: { id  },
//     data: {
//       email,
//       userName,
//     },
//   })
// }

// export async function updateChecked(
//   id: Item[`id`],
//   isChecked: Item[`isChecked`],
// ) {
//   return prisma.item.update({
//     where: {
//       id,
//     },
//     data: {
//       isChecked,
//     },
//   })
// }
// export async function updateUserById(
//   id: User[`id`],
//   email: User[`email`],
//   userName: User[`userName`],
// ): Promise<User | null> {
//   return prisma.user.delete({ where: { email } })
// }

export async function createUser(
  email: User[`email`],
  password: string,
): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  })
}

export async function deleteUserByEmail(email: User[`email`]): Promise<User> {
  return prisma.user.delete({ where: { email } })
}

export async function verifyLogin(
  email: User[`email`],
  password: Password[`hash`],
): Promise<User | null> {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

  if (!isValid) {
    return null
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword

  return userWithoutPassword
}
