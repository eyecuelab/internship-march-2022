import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import {
  redirect,
  Link,
  json,
  useLoaderData,
  useParams,
  useSearchParams,
  Outlet,
  Form,
} from "remix"

import type { Expense } from "@prisma/client"
import { Trip, Attendee, User } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeesByTripId } from "~/models/attendee.server"
import { getTripById, updateTripDates } from "~/models/trip.server"
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
  const trip = await getTripById(params.tripId)
  const attendees = await getAttendeesByTripId(params.tripId)
  invariant(attendees, `need attendees`)
  return { trip, attendees }
}
export const loader: LoaderFunction = async ({ params }) => {
  return json<LoaderData>(await getLoaderData(params))
}

type ActionData =
  | {
      tripId: string | null
      startDate: Date | null
      endDate: Date | null
    }
  | undefined

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const { tripId } = params
  const inputStartDate = formData.get(`startDate`)
  const inputEndDate = formData.get(`endDate`)
  const startDate = inputStartDate ? new Date(inputStartDate.toString()) : null
  const endDate = inputEndDate ? new Date(inputEndDate.toString()) : null

  // const errors: ActionData = {
  //   tripId: tripId ? null : `not a valid id`,
  //   inputStartDate: inputStartDate ? null : `Must be a date`,
  //   inputEndDate: inputEndDate ? null : `Must be a date`,
  // }
  // const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  // if (hasErrors) {
  //   return json<ActionData>(errors)
  // }

  // invariant(tripId, `tripId is not defined`)

  const trip = await updateTripDates({ tripId, startDate, endDate })

  return redirect(`/trips/${tripId}/`)
}

const Edit: FC = () => {
  const data = useLoaderData<LoaderData>()
  const tripId = useParams()

  const defaultAvatar = `public/img/default-avatar.jpg`
  const rectangleStyles = [`flex`, `mx-2`]
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `text-left`, `flex-1`]
  const backButtonHeaderRow = [`flex`, `mt-12`, `mb-16`]
  const costAmountStyles = [`flex-1`, `text-right`, `mr-2`]
  const centered = [`items-center`, `flex-col`, `mx-8`]
  const inputGrid = [`grid grid-flow-col grid-rows-2 gap-2`]
  return (
    <div>
      <div className={join(...backButtonHeaderRow)}>
        <Link to={`/trips/${tripId}`}>
          <div className={join(`ml-8`)}>
            <SvgBackButton />
          </div>
        </Link>
        <SubHeader>Edit Trip Details</SubHeader>
      </div>
      <Form method="post">
        <div className={join(...inputGrid)}>
          <AddButtonText>Start Date</AddButtonText>
          <InputField type="date" name="startDate" />
          <AddButtonText>End Date</AddButtonText>
          <InputField type="date" name="endDate" />
        </div>
        <p className={join(`py-6`)}>
          <button type="submit">Let&apos;s GoGo!</button>
        </p>
      </Form>
    </div>
  )
}

export default Edit
