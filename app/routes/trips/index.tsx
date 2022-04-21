import type { FC } from "react"

import { Link, json, useLoaderData, LoaderFunction } from "remix"

import type { Trip, Attendee } from "@prisma/client"
import { getAttendeesByUserId } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { join } from "~/utils"

type LoaderData = {
  pendingTrips: Trip[];
  acceptedTrips: Trip[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const attendees = await getAttendeesByUserId(userId)
  console.log(attendees)
  const pending = attendees.filter(trip => trip.isAccepted === null)
  const accepted = attendees.filter(trip => trip.isAccepted !== null)
  const pendingPromises = await Promise.all(
    pending.map(async (attendee) => (
      await getTripById(attendee.tripId)
    )))
  const acceptedPromises = await Promise.all(
    accepted.map(async (attendee) => (
      await getTripById(attendee.tripId)
    )))

  const pendingTrips = pendingPromises as Trip[]
  const acceptedTrips = acceptedPromises as Trip[]

  console.log(pendingTrips);
  console.log(acceptedTrips)
  return json<LoaderData>({
    pendingTrips: pendingTrips,
    acceptedTrips: acceptedTrips
  })
}

const Index: FC = () => {
  const { pendingTrips, acceptedTrips } = useLoaderData() as LoaderData
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
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Pending Trips
      </h1>
      <ul>
        {pendingTrips.map((trip: Trip) => (
          <li key={trip.id}>
            <Link
              to={trip.id}
              className={join(...linkStyles)}
            >
              {trip.nickName}
            </Link>
          </li>
        ))}
      </ul>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Accepted Trips
      </h1>
      <ul>
        {acceptedTrips.map((trip: Trip) => (
          <li key={trip.id}>
            <Link
              to={trip.id}
              className={join(...linkStyles)}
            >
              {trip.nickName}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to="/trips/new/"
        className={join(...linkStyles)}
      >
        Create Trip
      </Link>
      <Link
        to="/trips/trip-id-goes-here"
        className={join(...linkStyles)}
      >
        Example Trip
      </Link>
    </div>
  )
}

export default Index
//outlet
