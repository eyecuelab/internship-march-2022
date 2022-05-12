import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import {
  json,
  Form,
  redirect,
  useActionData,
  useParams,
  useLoaderData,
  useNavigate,
} from "remix"

import { useCatch } from "@remix-run/react"
import invariant from "tiny-invariant"

import type { Trip } from "~/models/trip.server"
import { getTripById, deleteTrip } from "~/models/trip.server"
import { getUserId } from "~/session.server"
import {
  ErrorDiv,
  ModalBackdrop,
  Modal,
  DangerBtn,
  TripBtn,
  ClearBtn,
  EditBtn,
} from "~/styles/styledComponents"
import SvgSwipeButton from "~/styles/SVGR/SvgSwipeButton"
import { join } from "~/utils"

import TripDetails from "./$tripId"

type LoaderData = {
  trip: Trip
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.tripId, `params.id is required`)

  const trip = await getTripById(params.tripId)
  invariant(trip, `Trip not found: ${params.tripId}`)

  return json<LoaderData>({ trip })
}

type ActionData =
  | {
      tripId: string | null
    }
  | undefined

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request)
  invariant(userId, `must be a user to delete trip`)
  invariant(params.tripId, `trips required`)
  const { tripId } = params
  invariant(typeof tripId === `string`, `tripId must be a string`)
  const trip = await getTripById(tripId)
  invariant(trip, `must have trip`)
  console.log(trip)

  const errors: ActionData = {
    tripId: tripId ? null : `This trip is no longer valid`,
  }
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  if (trip.ownerId === userId) {
    await deleteTrip(tripId.toString())
  }
  return redirect(`/home`)
}

const DeleteTrip: FC = () => {
  const params = useParams()
  const data = useLoaderData<LoaderData>()
  const actionData = useActionData()
  const navigate = useNavigate()
  console.log(data.trip.id)

  const outputError = (errorMessage: string) => {
    return (
      <ErrorDiv>
        <em>{errorMessage}</em>
        <br />
      </ErrorDiv>
    )
  }

  const centered = [
    `flex`,
    `items-center`,
    `justify-center`,
    `flex-col`,
    `-ml-8`,
  ]

  return (
    <div>
      <TripDetails />
      <ModalBackdrop
        onClick={() => navigate(`/trips/${params.tripId}/attendees/`)}
      />
      <Modal>
        <div className={join(...centered)}>
          <div
            className={join(`pt-2`, `mb-10`)}
            onClick={() => navigate(`/trips/${params.tripId}/attendees/`)}
          >
            <SvgSwipeButton />
          </div>
          {actionData?.tripId && outputError(actionData.tripId)}
          <EditBtn
            className={join(`w-full`, `mx-auto`)}
            onClick={() => navigate(`/trips/${params.tripId}/edit`)}
          >
            Edit Trip
          </EditBtn>
          <Form
            method="post"
            className={join(
              `w-full`,
              `mx-auto`,
              `flex`,
              `items-center`,
              `justify-center`,
              `mb-10`,
            )}
          >
            <DangerBtn type="submit" className={join(`w-full`, `mx-auto`)}>
              Delete Trip
            </DangerBtn>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export const CatchBoundary: FC = () => {
  const caught = useCatch()

  return (
    <ErrorDiv>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </ErrorDiv>
  )
}
export const ErrorBoundary: FC = () => {
  return <ErrorDiv>Something unexpected went wrong. Sorry about that.</ErrorDiv>
}

export default DeleteTrip
