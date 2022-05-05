import type { FC } from "react"

import type { LoaderFunction } from "remix"
import {
  Link,
  json,
  useLoaderData,
  useParams,
  useSearchParams,
  Outlet,
} from "remix"

import type { Expense } from "@prisma/client"
import { Trip, Attendee, User } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeesByTripId } from "~/models/attendee.server"
import { getExpensesByTripId } from "~/models/expense.server"
import {
  MainBtn,
  InputField,
  InputLabel,
  Header,
  RoundedRectangle,
  CostAmount,
  ModalBackdrop,
  Modal,
  TitleText,
  AddButtonText,
  Avatar,
  CostDescription,
  SubHeader,
} from "~/styles/styledComponents"
import SvgAddButton from "~/styles/SVGR/SvgAddButton"
import SvgBackButton from "~/styles/SVGR/SvgBackButton"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (params: Params<string>) => {
  invariant(params.tripId, `trips required`)
  const attendees = await getAttendeesByTripId(params.tripId)
  invariant(attendees, `need attendees`)
  return attendees
}
export const loader: LoaderFunction = async ({ params }) => {
  return json<LoaderData>(await getLoaderData(params))
}

const ExpenseLayout: FC = () => {
  const data = useLoaderData<LoaderData>()

  const userExpenses = data.map((attendee) =>
    attendee.expenses.map((expense: Expense) => expense.total),
  )

  const userTotals = userExpenses.map((expense) => {
    if (expense.length >= 1) {
      return expense.reduce(
        (prevExpense, currentExpense) => prevExpense + currentExpense,
      )
    }
  })

  const { tripId } = useParams()

  const defaultAvatar = `public/img/default-avatar.jpg`
  const rectangleStyles = [`flex`, `mx-2`]
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `text-left`, `flex-1`]
  const backButtonHeaderRow = [`flex`, `mt-12`, `mb-16`]
  const costAmountStyles = [`flex-1`, `text-right`, `mr-2`]

  return (
    <div>
      <div className={join(...backButtonHeaderRow)}>
        <Link to={`/trips/${tripId}`}>
          <div className={join(`ml-8`)}>
            <SvgBackButton />
          </div>
        </Link>
        <SubHeader>Cost Sharing</SubHeader>
      </div>

      <TitleText>
        <span className={join(`ml-8`)}>Expenses</span>
      </TitleText>
      {data.map((attendee, index) => (
        <div key={attendee.tripId + index}>
          <ul className={join(`mx-8`)}>
            {attendee.expenses.map((expense: Expense) => (
              <li key={expense.id}>
                <RoundedRectangle className={join(...rectangleStyles)}>
                  <div className={join(...avatarDivStyles)}>
                    <Avatar src={attendee.user.avatarUrl || defaultAvatar} />
                  </div>
                  <div className={join(...titleDivStyles)}>
                    <TitleText>{attendee.user.userName}</TitleText>
                    <CostDescription>{expense.description}</CostDescription>
                  </div>
                  <div>
                    <CostAmount className={join(...costAmountStyles)}>
                      ${expense.total}
                    </CostAmount>
                  </div>
                </RoundedRectangle>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <br></br>
      <TitleText>
        <span className={join(`ml-8`)}>Total Expenses</span>
      </TitleText>
      {data.map((attendee, index) => (
        <div key={attendee.userId}>
          {userTotals[index] ? (
            <ul className={join(`mx-8`)}>
              <li>
                <RoundedRectangle className={join(...rectangleStyles)}>
                  <div className={join(...avatarDivStyles)}>
                    <Avatar src={attendee.user.avatarUrl || defaultAvatar} />
                  </div>
                  <div className={join(...titleDivStyles)}>
                    <TitleText>{attendee.user.userName}</TitleText>
                  </div>
                  <div className={join(...costAmountStyles)}>
                    <CostAmount>${userTotals[index]}</CostAmount>
                  </div>
                </RoundedRectangle>
              </li>
            </ul>
          ) : null}
        </div>
      ))}
      <Outlet />
      <AddButtonText>
        <Link to={`new`}>
          <span className={join(`flex`, `m-8`)}>
            <SvgAddButton /> <span className={join(`ml-2`)}>Add Expense</span>
          </span>
        </Link>
      </AddButtonText>
    </div>
  )
}

export default ExpenseLayout
