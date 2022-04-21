import type { FC } from "react"

import type { LoaderFunction, ActionFunction } from "remix"
import { Link, json, useLoaderData, Form } from "remix"

import type { Trip, Attendee, User } from "@prisma/client"
import type { Params } from "react-router-dom"
import invariant from "tiny-invariant"

import { getAttendeesByUserId, updateAttendee } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { join } from "~/utils"

import {
  TripLiContainer,
  TripLiImage,
  TripLiTitle,
  TripLiFlex,
  TripLiDetail,
  TripLiGroup,
  TripHr,
  TripBtn,
  Header,
} from "../../styles/styledComponents"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  const userId = await requireUserId(request)
  invariant(userId, `userId required`)
  const attendees = await getAttendeesByUserId(userId)
  const pending = attendees.filter((trip) => trip.isAccepted === null)
  const accepted = attendees.filter((trip) => trip.isAccepted !== null)
  const pendingArray = await Promise.all(
    pending.map(async (attendee) => await getTripById(attendee.tripId)),
  )
  const acceptedArray = await Promise.all(
    accepted.map(async (attendee) => await getTripById(attendee.tripId)),
  )

  return {
    trips: {
      accepted: acceptedArray,
      pending: pendingArray,
    },
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}

type ActionData =
  | {
      nickName: string | null
    }
  | undefined

export const action: ActionFunction = async ({ request }) => {
  console.log(`button pressed`)
  const formData = await request.formData()
  const userId = await requireUserId(request)
  const tripIdData = formData.get(`tripId`)
  const isAccepted = new Date()

  invariant(tripIdData, `trip id can not be null`)
  const tripId = tripIdData?.toString()
  return await updateAttendee(tripId, userId, isAccepted)
}
const Index: FC = () => {
  const data = useLoaderData<LoaderData>()
  const categoryStyles = [
    `flex`,
    `items-center`,
    `justify-center`,
    `text-white`,
    `mr-64`,
  ]
  const linkStyles = [
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
  ]
  return (
    <div>
      <Header>Your Trips</Header>
      <h1 className={join(...categoryStyles)}>Pending Trips</h1>
      <ul>
        {data.trips.pending.map((trip) => (
          <TripLiContainer key={trip?.id}>
            <TripLiImage src="https://images.unsplash.com/photo-1541570213932-8cd806e3f8f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJvYWQlMjB0cmlwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60" />
            <TripLiTitle>
              {trip?.stops[0] ? trip?.stops[0] : `Start`} to{` `}
              {trip?.stops[-1] ? trip?.stops[-1] : `End`}
            </TripLiTitle>
            <TripHr />
            <TripLiFlex>
              <TripLiGroup>Starts</TripLiGroup>
              <TripLiGroup>Ends</TripLiGroup>
              <TripLiGroup>Stops</TripLiGroup>
              <TripLiDetail>
                {trip?.startDate ? trip?.startDate : `00/00/00`}
              </TripLiDetail>
              <TripLiDetail>
                {trip?.endDate ? trip?.endDate : `00/00/00`}
              </TripLiDetail>
              <TripLiDetail>{trip?.stops.length}</TripLiDetail>
            </TripLiFlex>
            <Form method="post">
              <input type="hidden" name="tripId" value={trip?.id} />
              <TripBtn type="submit">Accept Trip Invite</TripBtn>
            </Form>
          </TripLiContainer>
        ))}
      </ul>
      <h1 className={join(...categoryStyles)}>Accepted Trips</h1>
      <ul>
        {data.trips.accepted.map((trip) => (
          <TripLiContainer key={trip?.id}>
            <TripLiImage src="https://images.unsplash.com/photo-1541570213932-8cd806e3f8f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJvYWQlMjB0cmlwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60" />
            <TripLiTitle>
              {trip?.stops[0]} to {trip?.stops[-1]}
            </TripLiTitle>
            <TripHr />
            <TripLiFlex>
              <TripLiGroup>Starts</TripLiGroup>
              <TripLiGroup>Ends</TripLiGroup>
              <TripLiGroup>Stops</TripLiGroup>
              <TripLiDetail>
                {trip?.startDate ? trip?.startDate : `00/00/00`}
              </TripLiDetail>
              <TripLiDetail>
                {trip?.endDate ? trip?.endDate : `00/00/00`}
              </TripLiDetail>
              <TripLiDetail>{trip?.stops.length}</TripLiDetail>
            </TripLiFlex>
          </TripLiContainer>
        ))}
      </ul>
      <Link to="/trips/new/" className={join(...linkStyles)}>
        Create Trip
      </Link>
      <Link to="/trips/trip-id-goes-here" className={join(...linkStyles)}>
        Example Trip
      </Link>
    </div>
  )
}

export default Index
