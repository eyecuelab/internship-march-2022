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
  useFetcher,
} from "remix"

import type { Expense } from "@prisma/client"
import { Trip, Attendee, User } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeesByTripId, deleteAttendee } from "~/models/attendee.server"
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
  SaveButton,
  SmClearBtn,
  Hr,
} from "~/styles/styledComponents"
import SvgAddButton from "~/styles/SVGR/SvgAddButton"
import SvgBackButton from "~/styles/SVGR/SvgBackButton"
import SvgCloseCircleWhite from "~/styles/SVGR/SvgCloseCircleWhite"
import { join } from "~/utils"

const DEFAULT_DATE = new Date()

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (params: Params<string>) => {
  invariant(params.tripId, `trips required`)
  const trip = await getTripById(params.tripId)
  const attendees = await getAttendeesByTripId(params.tripId)
  invariant(attendees, `need attendees`)
  invariant(trip, `need a trip`)
  const startDate = trip.startDate?.toISOString().substring(0, 10)
  const endDate = trip.endDate?.toISOString().substring(0, 10)
  const defaultDate = new Date().toISOString().substring(0, 10)
  return { trip, attendees, startDate, endDate, defaultDate }
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
  //Date Editing
  console.log(`action function`)
  const formData = await request.formData()
  const { tripId } = params
  const inputStartDate = formData.get(`startDate`)
  const inputEndDate = formData.get(`endDate`)
  const startDate = inputStartDate ? new Date(inputStartDate.toString()) : null
  const endDate = inputEndDate ? new Date(inputEndDate.toString()) : null
  const currentDate = new Date().toString()

  // const errors: ActionData = {
  //   tripId: tripId ? null : `not a valid id`,
  //   inputStartDate: inputStartDate ? null : `Must be a date`,
  //   inputEndDate: inputEndDate ? null : `Must be a date`,
  // }
  // const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  // if (hasErrors) {
  //   return json<ActionData>(errors)
  // }
  invariant(tripId, `tripId must be defined`)

  const userId = formData.get(`userId`)
  if (userId) {
    console.log(`deleting`)
    await deleteAttendee(tripId, userId.toString())
    return redirect(`/trips/${tripId}/edit`)
  }
  await updateTripDates(tripId, startDate, endDate)
  return redirect(`/trips/${tripId}/`)
}

const Edit: FC = () => {
  const data = useLoaderData<LoaderData>()
  const { attendees } = data
  const fetcher = useFetcher()

  const params = useParams()
  const currentStartDate = data.startDate ? data.startDate : data.defaultDate
  const currentEndDate = data.endDate ? data.endDate : data.defaultDate

  const defaultAvatar = `public/img/default-avatar.jpg`
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `text-left`, `flex-1`]
  const backButtonHeaderRow = [`flex`, `mt-12`, `mb-16`]
  const costAmountStyles = [`flex-1`, `text-right`, `mr-2`]
  const inputGrid = [`grid grid-flow-col grid-rows-2 gap-8`]
  const negativeMargin = [`-mt-6`]
  const buttonFlex = [`flex`, `items-centered`, `gap-8`]

  return (
    <div className={join(`mx-8`)}>
      <div className={join(...backButtonHeaderRow)}>
        <Link to={`/trips/${params.tripId}`}>
          <div className={join(`ml-8`)}>
            <SvgBackButton />
          </div>
        </Link>
        <SubHeader>Edit Trip Details</SubHeader>
      </div>
      <Form method="post">
        <div className={join(...inputGrid)}>
          <AddButtonText>Start Date</AddButtonText>
          <div className={join(...negativeMargin)}>
            <InputField
              type="date"
              name="startDate"
              defaultValue={currentStartDate}
            />
          </div>
          <AddButtonText>End Date</AddButtonText>
          <div className={join(...negativeMargin)}>
            <InputField
              type="date"
              name="endDate"
              defaultValue={currentEndDate}
            />
          </div>
        </div>
        <div className={join(`pt-8`)}>
          <RoundedRectangle>
            <TitleText>
              <span className={join(`ml-8`)}>Travelers</span>
            </TitleText>
            <ul>
              {attendees.map((attendee) =>
                attendee.userId !== attendee.trip.ownerId ? (
                  <Form method="post" key={attendee.userId}>
                    <div>
                      <li>
                        <div className={join(...avatarDivStyles)}>
                          <Avatar
                            src={attendee.user.avatarUrl || defaultAvatar}
                          />
                        </div>
                        <div className={join(...titleDivStyles)}>
                          <TitleText>{attendee.user.userName}</TitleText>
                        </div>
                        <div className={join(...costAmountStyles)}>
                          <button type="submit">
                            <SvgCloseCircleWhite />
                          </button>
                        </div>
                        <Hr />
                      </li>
                    </div>
                    <input
                      hidden
                      readOnly
                      name="userId"
                      value={attendee.userId}
                    />
                  </Form>
                ) : null,
              )}
            </ul>
            <Outlet />
            <AddButtonText>
              <Link to={`new`}>
                <span className={join(`flex`, `m-8`)}>
                  <SvgAddButton />
                  {` `}
                  <span className={join(`ml-2`)}>Add Traveler</span>
                </span>
              </Link>
            </AddButtonText>
          </RoundedRectangle>
        </div>
        <p className={join(`py-8`, ...buttonFlex)}>
          <SmClearBtn>Cancel</SmClearBtn>
          <SaveButton type="submit">Save</SaveButton>
        </p>
      </Form>
    </div>
  )
}

export default Edit
