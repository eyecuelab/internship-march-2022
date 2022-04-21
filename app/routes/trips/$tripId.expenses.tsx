import type { FC } from "react"
import type { Params } from "react-router"
import { LoaderFunction, Link, json, useLoaderData, useParams, useSearchParams } from "remix"
 
import invariant from "tiny-invariant"
import { Trip, Attendee, Expense, User } from "@prisma/client"
import { getExpensesByTripId } from "~/models/expense.server"
import { getAttendeesByTripId } from "~/models/attendee.server"
import { join } from "~/utils"
import { MainBtn, InputField, InputLabel, Header, SubHeader, RoundedRectangle, CostText } from "../../styles/styledComponents"



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

  const totalExpenses = data.map((attendee)=> (
                        attendee.expenses.map((expense: Expense) =>(
                          expense.total
                          ))
                        ))
  console.log(totalExpenses)

  const userTotals = totalExpenses.map(
                        expense =>[...expense].reduce(
                          (prevExpense, currentExpense) => prevExpense + currentExpense))

console.log(userTotals)

  return (
    <div>
    <Header>
      Cost Sharing
    </Header>
      <SubHeader>
        Expenses
      </SubHeader>
      {data.map((attendee)=> (
        <div key={attendee.tripId}>
         <ul>      
          {attendee.expenses.map((expense: Expense) =>(
           <li key={expense.id}>
            <RoundedRectangle>
              <SubHeader>{ attendee.user.userName}</SubHeader> 
               {expense.description}
              <CostText>${expense.total}</CostText>
            </RoundedRectangle>
          </li> 
         ))}
         </ul>
        </div>
       ))}
   <br></br>
    <SubHeader>
      Expense Totals
    </SubHeader>
      {data.map((attendee, index)=> (
        <div key={attendee.tripId}>
          <ul>
            <li>
              <RoundedRectangle>
                <SubHeader>{attendee.user.userName}</SubHeader> 
                <CostText>${userTotals[index]}</CostText>
              </RoundedRectangle>
            </li>
          </ul>
        </div>
       ))}
    <br></br>
    <SubHeader>
      <p>
        <Link
        to="/trips"
        >
        Return to trip dashboard
        </Link>
      </p>
      <p><Link
        to="/profile"
        >
        Return to profile
        </Link>
      </p>
      <p>
        <Link
        to={`new`}
        >
        Add Expense
        </Link>
      </p>
    </SubHeader>
  </div>
  )
}

export default Expenses
