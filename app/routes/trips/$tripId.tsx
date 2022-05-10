import { link } from "fs"

import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Link, Outlet, NavLink, json, useLoaderData } from "remix"

import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getTripById } from "~/models/trip.server"
import { formatTrip, join } from "~/utils"

import AttendeesLayout from "./$tripId/attendees"
import StopsLayout from "./$tripId/stops"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

export const loader: LoaderFunction = async ({ params }) => {
  return json(await getLoaderData(params))
}

const getLoaderData = async (params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `must have tripId`)
  const trip = await getTripById(tripId)
  invariant(trip, `trip must exist`)
  return trip
  console.log(trip)
}

const TripDetails: FC = () => {
  const trip = useLoaderData<LoaderData>()

  console.log(trip)
  return (
    <div>
      <Link to="/home" className={join()}>
        X asdfasdfs
      </Link>
      <div className={join(`mx-8`)}>
        <h1 className={join(`flex`, `items-center`, `justify-center`)}>
          Trip name goes here
        </h1>
        <NavLink to={`/trips/${trip.id}`}>{/* <AttendeesLayout /> */}</NavLink>
      </div>
    </div>
  )
}
//to: `/home`,

// index.tsx --> Overview / Stops

export default TripDetails
