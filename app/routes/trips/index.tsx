import type { FC } from "react"

import type { LoaderFunction, ActionFunction } from "remix"
import { json, useLoaderData, Form } from "remix"

import type { Params } from "react-router-dom"
import invariant from "tiny-invariant"

import TripView from "~/components/TripView"
import {
  deleteAttendee,
  getAttendeesByUserId,
  updateAttendee,
} from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { join, formatTrip } from "~/utils"
import type { TripWithFormattedStops } from "~/utils"

import { Header } from "../../styles/styledComponents"
import NavBar from "../navbar"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  const userId = await requireUserId(request)
  invariant(userId, `userId required`)
  const attendees = await getAttendeesByUserId(userId)

  const pending = attendees.filter((trip) => trip.isAccepted === null)
  const accepted = attendees.filter((trip) => trip.isAccepted !== null)
  const pendingArray: TripWithFormattedStops[] = []
  const acceptedArray: TripWithFormattedStops[] = []
  await Promise.all(
    pending.map(async (attendee) => {
      const trip = await getTripById(attendee.tripId)
      if (trip) {
        const newTrip: TripWithFormattedStops = formatTrip(trip)
        pendingArray.push(newTrip)
      }
    }),
  )
  await Promise.all(
    accepted.map(async (attendee) => {
      const trip = await getTripById(attendee.tripId)
      if (trip) {
        const newTrip: TripWithFormattedStops = formatTrip(trip)
        acceptedArray.push(newTrip)
      }
    }),
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const userId = await requireUserId(request)
  const tripIdData = formData.get(`tripId`)
  const isAccepted = new Date()
  const decline = formData.get(`decline`)
  invariant(tripIdData, `trip id can not be null`)
  const tripId = tripIdData?.toString()
  if (decline) {
    return await deleteAttendee(tripId, userId)
  }
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

  return (
    <div className={join(`pb-24`)}>
      <Header>Your Trips</Header>
      <h1 className={join(...categoryStyles)}>Trip Requests</h1>
      <ul>
        {data.trips.pending.map((trip) => (
          <TripView key={trip.id} trip={trip} isAccepted={false} />
        ))}
      </ul>
      <h1 className={join(...categoryStyles)}>My Trips</h1>
      <ul>
        {data.trips.accepted.map((trip) => (
          <TripView key={trip.id} trip={trip} isAccepted={true} />
        ))}
      </ul>
      <NavBar />
    </div>
  )
}

export default Index
