import type { FC } from "react"

import type { LoaderFunction, ActionFunction } from "remix"
import { Link, useLoaderData, Form, json } from "remix"

import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { deleteStopById, getStopById, updateStop } from "~/models/stop.server"
import { getTripById } from "~/models/trip.server"
import { RoundedRectangle } from "~/styles/styledComponents"
import SvgCloseCircle from "~/styles/SVGR/SvgCloseCircle"
import { join, formatStops } from "~/utils"
import type { FormattedStop } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>
const getLoaderData = async (request: Request, params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `Trip Id must exist`)

  const trip = await getTripById(tripId)
  invariant(trip, `Trip must exist`)

  const formattedStops = formatStops(trip.stops)
  formattedStops.sort((a, b) => (a.index > b.index ? 1 : -1))
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
  const upIndex = formData.get(`upIndex`)
  const downIndex = formData.get(`downIndex`)
  invariant(id, `Did not find a valid id`)
  const stop = await getStopById(id.toString())
  invariant(stop, `Did not find stop`)
  invariant(params.tripId, `Did not find a trip id`)
  const trip = await getTripById(stop.tripId)
  invariant(trip, `Did not find trip`)
  if (upIndex && stop.index < trip.stops.length - 1) {
    stop.index++
    return await updateStop(stop)
  }
  if (downIndex && stop.index > 0) {
    stop.index--
    return await updateStop(stop)
  }
  if (!upIndex && !downIndex) {
    return await deleteStopById(id.toString(), params.tripId)
  }
  return null
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
            src={stop.apiResult.icon}
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
          <div className={join(`flex`, `ml-auto`)}>
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
              <input hidden readOnly name="upIndex" value={stop.index} />
              <input hidden readOnly name="stopId" value={stop.id} />
              <button type="submit" className={join(`text-3xl`)}>
                ↓
              </button>
            </Form>
            <Form method="post" className={join(`ml-3`)}>
              <input hidden readOnly name="downIndex" value={stop.index} />
              <input hidden readOnly name="stopId" value={stop.id} />
              <button type="submit" className={join(`text-3xl`)}>
                ↑
              </button>
            </Form>
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
            <button type="submit">
              <SvgCloseCircle />
            </button>
          </Form>
        </RoundedRectangle>
      ))}
      <Link to="new">Add Stop</Link>
    </div>
  )
}

export default Stops
