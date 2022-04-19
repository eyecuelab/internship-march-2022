import type { FC } from "react"
import type { Params } from "react-router"
import { LoaderFunction, Link, json, useLoaderData, useParams, useSearchParams } from "remix"
 
import invariant from "tiny-invariant"
import { Trip, Attendee, Expense, User } from "@prisma/client"
import { getExpensesByTripId } from "~/models/expense.server"
import { getAttendeesByTripId } from "~/models/attendee.server"
import { join } from "~/utils"



type LoaderData =  Awaited<ReturnType<typeof getLoaderData>>;

const getLoaderData = async (params: Params<string>) => {
  invariant(params.tripId, `trips required`)
  return await getAttendeesByTripId(params.tripId)
}
export const loader: LoaderFunction = async({params}) => {
  invariant(params.tripId, `tripId is required`)
  return json<LoaderData>(await getLoaderData(params))
}


const Expenses: FC = () => {
  const data = useLoaderData<LoaderData>() 

  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Expenses
      </h1>
      {data.map((attendee)=> (
    <div key={attendee.tripId}>
      <h1>{attendee.user.userName}</h1>
      <ul>
        {attendee.expenses.map((expense: Expense) =>(
          <li key={expense.id}>Expense: {expense.description} Total: $ {expense.total}</li> 
        ))}
      </ul>
    </div>
    ))}
      <Link
        to="/trips/trip-id-goes-here/"
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
        Return to trip dashboard
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
      <Link
        to="/trips/trip-id-goes-here/expenses/new"
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
        Add Expense
      </Link>
    </div>
  )
}

export default Expenses
