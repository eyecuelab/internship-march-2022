import type { FC } from "react"

import type { LoaderFunction, ActionFunction } from "remix"
import { Link, useLoaderData, Form, json } from "remix"

import type { Trip, Stop } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeeById } from "~/models/attendee.server"
import { deleteStopById } from "~/models/stop.server"
import { getTripById } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { RoundedRectangle } from "~/styles/styledComponents"
import { join, formatStops } from "~/utils"
import type { FormattedStop } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>
const getLoaderData = async (request: Request, params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `Trip Id must exist`)

  const trip = await getTripById(tripId)
  invariant(trip, `Trip must exist`)

  const formattedStops = formatStops(trip.stops)
  return {
    stops: formattedStops,
    apiKey: process.env.MAP_API,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const id = formData.get(`stopId`)
  invariant(id, `Did not find a valid id`)
  invariant(params.tripId, `Did not find a trip id`)
  return await deleteStopById(id.toString(), params.tripId)
}
const Stops: FC = () => {
  const data = useLoaderData()
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Stops List
      </h1>
      {data.stops.map((stop: FormattedStop) => (
        <RoundedRectangle key={stop.id} className={join(`flex`)}>
          <img
            src={stop.apiResult?.icon.toString()}
            className={join(
              `flex`,
              `items-center`,
              `justify-center`,
              `h-8`,
              `mr-4`,
            )}
          />
          <div>
            <h1 className={join(`text-base`)}>{stop.apiResult?.name}</h1>
            <h1>{stop.apiResult?.formatted_address}</h1>
          </div>
          <Form
            method="post"
            className={join(
              `ml-auto`,
              `mr-0`,
              `flex`,
              `items-center`,
              `justify-center`,
            )}
          >
            <input hidden readOnly name="stopId" value={stop.id} />
            <button type="submit">Delete</button>
          </Form>
        </RoundedRectangle>
      ))}
      <Link to="new">Add Stop</Link>
    </div>
  )
}

export default Stops
