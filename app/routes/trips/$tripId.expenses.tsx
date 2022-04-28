import type { FC } from "react"
import { useState } from "react"

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
} from "~/styles/styledComponents"
import SvgAddButton from "~/styles/SVGR/SvgAddButton"
import SvgBackButton from "~/styles/SVGR/SvgBackButton"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (params: Params<string>) => {
  invariant(params.tripId, `trips required`)
  return await getAttendeesByTripId(params.tripId)
}
export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.tripId, `tripId is required`)
  return json<LoaderData>(await getLoaderData(params))
}

const ExpenseLayout: FC = () => {
  const [showModal, setShowModal] = useState(false)

  const displayNewExpense = () => {
    return setShowModal(true)
  }

  const data = useLoaderData<LoaderData>()

  const userExpenses = data.map((attendee) =>
    attendee.expenses.map((expense: Expense) => expense.total),
  )
  console.log(userExpenses)

  const userTotals = userExpenses.map((expense) => {
    if (expense.length >= 1) {
      return expense.reduce(
        (prevExpense, currentExpense) => prevExpense + currentExpense,
      )
    }
  })

  const params = useParams()
  const { tripId } = params

  console.log(userTotals)
  console.log(params)

  const rectangleStyles = [`flex`, `mx-2`]
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `text-left`, `flex-1`]
  const costAmountStyles = [`flex-1`, `text-right`, `mr-2`]

  return (
    <div>
      <div className={join(`ml-8`)}>
        <SvgBackButton />
      </div>
      <Header>Cost Sharing</Header>
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
                    <Avatar src="https://s3-alpha-sig.figma.com/img/5371/122a/0163605d7f0ffd3bd46a8da315309d1f?Expires=1652054400&Signature=UlgB3Oj~OsNDovphm6GxObGvlddnNbzoNEDMk0iWF4pBZPV7PSJy4CigBXe-A8GlCazRZadEhkBrvIoMuvpD7q~frCVC-H5lyejFElj1KDotey4S-ty9BHBvl847S9AV8rdajvynfLJ5ELCshPfK~JZMj2aLExuJ8lQWh0mzg5z3Cq0raZXjevpKxpGSANqrwNBOmWiO2PXWqzd--pFGAOEqUjtFvL8jBRYVuGErUVq68T3UWFBC26LnlTOQDEwAxzKIQnQj1Sm3hu8owK9C8XKK4ydevEbDM1~C83v4WJ8F9HN9aYgKXPO-Lk3IuNQF-oihPBElteowoL973HeLcA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" />
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
                    <Avatar src="https://s3-alpha-sig.figma.com/img/5371/122a/0163605d7f0ffd3bd46a8da315309d1f?Expires=1652054400&Signature=UlgB3Oj~OsNDovphm6GxObGvlddnNbzoNEDMk0iWF4pBZPV7PSJy4CigBXe-A8GlCazRZadEhkBrvIoMuvpD7q~frCVC-H5lyejFElj1KDotey4S-ty9BHBvl847S9AV8rdajvynfLJ5ELCshPfK~JZMj2aLExuJ8lQWh0mzg5z3Cq0raZXjevpKxpGSANqrwNBOmWiO2PXWqzd--pFGAOEqUjtFvL8jBRYVuGErUVq68T3UWFBC26LnlTOQDEwAxzKIQnQj1Sm3hu8owK9C8XKK4ydevEbDM1~C83v4WJ8F9HN9aYgKXPO-Lk3IuNQF-oihPBElteowoL973HeLcA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" />
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
      <div
      // onClick={() => {
      //   displayNewExpense()
      // }}
      >
        <Outlet />
        <AddButtonText>
          <Link to={`new`}>
            <span className={join(`flex`, `m-8`)}>
              <SvgAddButton /> <span className={join(`ml-2`)}>Add Expense</span>
            </span>
          </Link>
        </AddButtonText>
      </div>
    </div>
  )
}

export default ExpenseLayout

// {
//   winModal && <WinModal shuffleCards={shuffleCards} className="card-grid" />
// }
