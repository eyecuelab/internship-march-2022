import type { FC } from "react"

import type { ActionFunction } from "remix"
import {
  redirect,
  LoaderFunction,
  useOutletContext,
  useLoaderData,
  useParams,
} from "remix"

import invariant from "tiny-invariant"

import StopResult from "~/components/StopResult"
import { getStopsByTripId, createStop } from "~/models/stop.server"

import type { ActionData } from "../new"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const apiResult = formData.get(`result`)?.toString()
  const tripId = formData.get(`tripId`)?.toString()

  invariant(apiResult, `apiResult not found`)
  invariant(tripId, `tripId not found`)
  const stops = await getStopsByTripId(tripId)
  const index = stops.length > 2 ? stops.length - 1 : stops.length
  await createStop({ apiResult, tripId, index })

  return redirect(`/trips/${tripId}/stops/`)
}

const NewStopSearch: FC = () => {
  const context: ActionData = useOutletContext()
  const { tripId } = useParams()
  return (
    <div>
      {context?.data?.results?.map(
        (result: Record<string, number | string>, index: number) => (
          <StopResult key={index} result={result} tripId={tripId} />
        ),
      )}
    </div>
  )
}
export default NewStopSearch
