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
  tripId:  string | null
  inputDescription: string | null 
  inputTotal: string | null
} 
| undefined

export const action: ActionFunction = async({request, params}) => {
  const userId = await requireUserId(request)
  const tripId = params.tripId 
  const formData = await request.formData()
  const inputDescription = formData.get(`description`)
  const inputTotal = formData.get(`total`)
  const description = inputDescription?.toString()

  
  const total = Number(inputTotal)
  
  const errors: ActionData = {
    userId: userId ? null : `not a valid id`,
    tripId: tripId ? null : `not a valid id`,
    inputDescription: inputDescription ? null : "Description is required",
    inputTotal: inputTotal ? null : "Amount is required"
  }
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
    );
    if (hasErrors) {
      return json<ActionData>(errors);
    }
    
    invariant(tripId, `tripId is not defined`)
    invariant(userId, `userId is not defined`)
    invariant(description, `description is not defined`)
  
const expense = await createExpense({ description, total, userId, tripId })

  return redirect(`/trips/${tripId}/expenses`)
}

const NewExpense: FC = () => {
  return (
    <div>
      <h1> Add Your Expenses</h1>
        <form method="post">
        <p>
        <label>
          Description:{" "}
          <input
            type="text"
            name="description"
          />
        </label>
      </p>
      <p>
        <label>
          Total Spent $:{" "}
          <input
            type="number"
            name="total"
          />
        </label>
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Add Expense
        </button>
      </p>
    </form>  
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
