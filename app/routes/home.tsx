import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import { Link, json, Form, redirect, useActionData, useLoaderData } from "remix"

import invariant from "tiny-invariant"

import TripView from "~/components/TripView"
import {
  createAttendee,
  getUpcomingTripByUserId,
} from "~/models/attendee.server"
import { createDecider } from "~/models/decider.server"
import { createTrip, updateTrip } from "~/models/trip.server"
import { getUserId, requireUserId } from "~/session.server"
import {
  AddButtonText,
  Header,
  HomePageImg,
  InputField,
  PhotoOverlay,
  SideBySideInputs,
  TitleText,
  WideButton,
} from "~/styles/styledComponents"
import { TripWithFormattedStops, join, formatTrip } from "~/utils"

import NavBar from "./navbar"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request) => {
  const userId = await getUserId(request)
  invariant(userId, `userId is required`)
  const upcomingTrip = await getUpcomingTripByUserId(userId)
  if (!upcomingTrip) {
    return null
  }
  const trip = formatTrip(upcomingTrip)
  return trip
}
export const loader: LoaderFunction = async ({ request }) => {
  const data = await getLoaderData(request)
  if (data === null) {
    return null
  }
  return json<LoaderData>(data)
}

type ActionData =
  | {
      nickName: string | null
    }
  | undefined

export const action: ActionFunction = async ({ request }) => {
  const ownerId = await requireUserId(request)
  const formData = await request.formData()

  const nickName = formData.get(`nickName`)
  const inputStartDate = formData.get(`startDate`)
  const inputEndDate = formData.get(`endDate`)
  const startDate = inputStartDate ? new Date(inputStartDate.toString()) : null
  const endDate = inputEndDate ? new Date(inputEndDate.toString()) : null

  const errors: ActionData = {
    nickName: nickName ? null : `nickName is required`,
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  invariant(typeof nickName === `string`, `nickName must be a string`)

  const trip = await createTrip({
    nickName,
    owner: { connect: { id: ownerId } },
    startDate,
    endDate,
  })

  const tripId = trip.id
  const userId = ownerId
  await createAttendee({ tripId, userId })
  const decider = await createDecider({ tripId })
  invariant(decider, `decider not created successfully`)
  await updateTrip(tripId, decider.id)
  return redirect(`/trips`)
}

const Home: FC = () => {
  const trip = useLoaderData<LoaderData>()
  const defaultPhoto = `public/img/dashboard.jpg`

  const errors = useActionData()
  const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`

  const centered = [`items-center`, `flex-col`, `mx-8`]
  const inputGrid = [`grid grid-flow-col grid-rows-2 gap-2`]

  return (
    <div>
      <Header>Welcome!</Header>
      <TitleText>
        <span className={join(`ml-8`)}>Plan a Trip</span>
      </TitleText>
      <div className={join(...centered)}>
        <Form method="post">
          <p className={join(`py-6`)}>
            {errors?.nickName ? (
              <em className="text-red-600">{errors.nickName}</em>
            ) : null}
            <InputField
              type="text"
              name="nickName"
              placeholder="e.g: Denver Hiking Trip"
            />
          </p>
          <div className={join(...inputGrid)}>
            <AddButtonText>Start Date</AddButtonText>
            <InputField type="date" name="startDate" />
            <AddButtonText>End Date</AddButtonText>
            <InputField type="date" name="endDate" />
          </div>
          {/* <div className={join(...inputGrid)}>
            <AddButtonText>Start Location</AddButtonText>
            <input type="text" name="startLocation" />
            <AddButtonText>End Location</AddButtonText>
            <input type="text" name="endLocation" />
          </div> */}
          <p className={join(`py-6`)}>
            <WideButton type="submit">Let&apos;s GoGo!</WideButton>
          </p>
        </Form>
      </div>
      <div className={join(`py-8`)}>
        <TitleText>
          <span className={join(`ml-8`)}>Current Trip</span>
        </TitleText>
      </div>
      {!trip && (
        <div>
          <PhotoOverlay />
          <HomePageImg src={defaultPhoto} />
        </div>
      )}
      {trip && <TripView trip={trip} />}
      <NavBar />
    </div>
  )
}

export default Home
