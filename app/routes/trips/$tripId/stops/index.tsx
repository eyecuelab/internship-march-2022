import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Link, useLoaderData, useParams, json } from "remix"

import type { Trip, Stop } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeeById } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { RoundedRectangle } from "~/styles/styledComponents"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>
type FormattedStop = {
  id: string
  tripId: string
  apiResult: Record<string, number | string>
  index: number
  createdAt: Date
  updatedAt: Date
}
const getLoaderData = async (request: Request, params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `Trip Id must exist`)
  const trip = await getTripById(tripId)
  invariant(trip, `Trip must exist`)
  console.log(trip.stops)
  const formattedStops: FormattedStop[] = trip.stops.map(
    (s) => s.apiResult && JSON.parse(s.apiResult),
  )
  return {
    stops: formattedStops,
    apiKey: process.env.MAP_API,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}

const Stops: FC = () => {
  const data = useLoaderData()
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Stops List
      </h1>
      {data.stops.map((stop: FormattedStop) => (
        <RoundedRectangle key={stop.id}>
          <h1>
            {stop.index}
            {stop.apiResult?.formatted_address}
          </h1>
        </RoundedRectangle>
      ))}
      <Link to="new">Add Stop</Link>
    </div>
  )
}

export default Stops
