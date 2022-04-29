import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Link, useLoaderData, useParams, json } from "remix"

import type { Trip, Stop } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { TestMap } from "~/components/TestMap"
import { getAttendeeById } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>
type TripWithStops = Trip & { stops: Stop[] }

const getLoaderData = async (request: Request, params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `Trip Id must exist`)
  const trip = await getTripById(tripId)
  invariant(trip, `Trip must exist`)
  return {
    stops: trip.stops,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}

const Stops: FC = () => {
  const data = useLoaderData()
  console.log(data.stops)
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Stops List
      </h1>
      <Link to="new">Add Stop</Link>
    </div>
  )
}

export default Stops
