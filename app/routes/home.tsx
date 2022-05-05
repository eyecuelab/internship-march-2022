import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import { Link, json, Form, redirect, useActionData, useLoaderData } from "remix"

import invariant from "tiny-invariant"

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
  InputField,
  SideBySideInputs,
  TitleText,
  WideButton,
} from "~/styles/styledComponents"
import { join } from "~/utils"

import NavBar from "./navbar"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request) => {
  const userId = await getUserId(request)
  invariant(userId, `userId is required`)
  const upcomingTrip = getUpcomingTripByUserId(userId)

  return upcomingTrip
}
export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(await getLoaderData(request))
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

  const errors: ActionData = {
    nickName: nickName ? null : `nickName is required`,
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  invariant(typeof nickName === `string`, `nickName must be a string`)

  const trip = await createTrip({ nickName, ownerId })

  const tripId = trip.id
  const userId = ownerId
  await createAttendee({ tripId, userId })
  const decider = await createDecider({ tripId })
  invariant(decider, `decider not created successfully`)
  await updateTrip(tripId, decider.id)
  return redirect(`/trips`)
}

const Home: FC = () => {
  const data = useLoaderData<LoaderData>()

  console.log(data)

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
            <input type="date" name="startDate" />
            <AddButtonText>End Date</AddButtonText>
            <input type="date" name="endDate" />
          </div>
          {/* <div className={join(...inputGrid)}>
            <AddButtonText>Start Location</AddButtonText>
            <input type="text" name="startLocation" />
            <AddButtonText>End Location</AddButtonText>
            <input type="text" name="endLocation" />
          </div> */}
          <p className={join(`py-6`)}>
            <WideButton type="submit">Let's GoGo!</WideButton>
          </p>
        </Form>
      </div>
      <div className={join(`py-8`)}>
        <TitleText>
          <span className={join(`ml-8`)}>Current Trip</span>
        </TitleText>
      </div>
      <div>Trip Component Here</div>
      <NavBar />
    </div>
  )
}

export default Home
