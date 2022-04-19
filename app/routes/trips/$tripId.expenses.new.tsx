import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"

import { Link, json, Form, redirect, useActionData, useParams, useLoaderData } from "remix"

import { Expense, createExpense } from "~/models/expense.server"
import { Attendee, getAttendeesByTripId } from "~/models/attendee.server"
import { requireUserId } from "~/session.server"
import { Trip } from "~/models/trip.server"

import { join } from "~/utils"
import invariant from "tiny-invariant"

type ActionData = |{ 
  userId:  string | null
  inputDescription: string | null 
  inputTotal: string | null
} 
| undefined

export const action: ActionFunction = async({request}) => {
  const userId= await requireUserId(request)
  const formData = await request.formData()
  const inputDescription = formData.get(`description`)
  const inputTotal = formData.get(`total`)
  const description = inputDescription?.toString()
  
  const total = Number(inputTotal)
  
  const errors: ActionData = {
    userId: userId ? null : `not a valid id`,
    inputDescription: inputDescription ? null : "Description is required",
    inputTotal: inputTotal ? null : "Amount is required"
  }
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
    );
    if (hasErrors) {
      return json<ActionData>(errors);
    }
    
    invariant(typeof inputDescription === `string`, "description should be a string"),
    invariant(typeof inputTotal === `string`, "total should be a string")
  
  const expense = await createExpense({ userId, description, total })

  return redirect("/expenses")
}

const NewExpense: FC = () => {


  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        New Expense Form
      </h1>
      <Link
        to="/trips"
        className={join(
          `flex`,
          `items-center`,
          `justify-center`,
          `rounded-md`,
          `border`,
          `border-transparent`,
          `bg-white`,
          `px-4`,
          `py-3`,
          `text-base`,
          `font-medium`,
          `text-yellow-700`,
          `shadow-sm`,
          `hover:bg-yellow-50`,
          `sm:px-8`,
        )}
      >
        Return to trips
      </Link>
      <Link
        to="/profile"
        className={join(
          `flex`,
          `items-center`,
          `justify-center`,
          `rounded-md`,
          `border`,
          `border-transparent`,
          `bg-white`,
          `px-4`,
          `py-3`,
          `text-base`,
          `font-medium`,
          `text-yellow-700`,
          `shadow-sm`,
          `hover:bg-yellow-50`,
          `sm:px-8`,
        )}
      >
        Return to profile
      </Link>
    </div>
  )
}

export default NewExpense
