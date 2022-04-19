import type { FC } from "react"

import { LoaderFunction, Link, json, useLoaderData, useParams, useSearchParams } from "remix"
 
import invariant from "tiny-invariant"
import { Trip, Attendee, Expense, User } from "@prisma/client"
import { getExpensesByTripId } from "~/models/expense.server"
import { getAttendeesByTripId } from "~/models/attendee.server"
import { join } from "~/utils"

// interface FullAttendee extends Attendee {
//   user: User;
//   expenses: Expense[]
// }
//Should we have a utils folder for interfaces to import when we need them or just include them in each component
//with properties as we need them? 


// type LoaderData= { 
//   attendees: Attendee[]
// }

export const loader: LoaderFunction = async({params}) => {
  invariant(params.tripId, `tripId is required`)
  const attendees = await getAttendeesByTripId(params.tripId)
  return json({
  attendees
  },)
}


const Expenses: FC = () => {
  const { attendees } = useLoaderData()
  console.log({attendees})

  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Expenses
        
      </h1>
      {attendees.map((attendee)=> (
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
