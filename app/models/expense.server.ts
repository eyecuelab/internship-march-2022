import type {Expense, User, Trip, Attendee, Prisma } from "@prisma/client"


import { prisma } from "../db.server"

export type { Expense } from "@prisma/client"

export async function createExpense(expense: Pick<Expense, `description`| `total`| `tripId` | `userId`>) {
  return prisma.expense.create({data: expense })
  }



  export async function getExpensesByTripId(tripId: Trip[`id`]) { 
    return prisma.expense.findMany({ where: { tripId: tripId } })
  }
