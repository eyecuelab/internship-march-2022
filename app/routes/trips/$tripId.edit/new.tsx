import type { FC, useEffect } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import {
  Link,
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

import { createAttendee } from "~/models/attendee.server"
import type { Trip } from "~/models/trip.server"
import { getTripById } from "~/models/trip.server"
import { getUserByEmail } from "~/models/user.server"
import {
  MainBtn,
  InputField,
  InputLabel,
  Header,
  ErrorDiv,
  ModalBackdrop,
  Modal,
  AddButtonText,
} from "~/styles/styledComponents"
import SvgSwipeButton from "~/styles/SVGR/SvgSwipeButton"
import { join, validateEmail } from "~/utils"

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
      email: string | null
      user: string | null
    }
  | undefined

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const tripIdInput = formData.get(`tripId`)
  const email = formData.get(`email`)

  invariant(email, `email must exist`)

  const tripId = tripIdInput ? tripIdInput.toString() : null
  const user = await getUserByEmail(email.toString())
  const userId = user?.id

  const errors: ActionData = {
    tripId: tripId ? null : `This trip is no longer valid`,
    email: validateEmail(email) ? null : `Please enter a valid email address`,
    user: user ? null : `Please enter an existing user`,
  }
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  invariant(typeof tripId === `string`, `tripId must be a string`)
  invariant(typeof userId === `string`, `userId must be a string`)

  await createAttendee({ tripId, userId })
  return redirect(`/trips/${tripId}/edit`)
}

const NewAttendee: FC = () => {
  const params = useParams()
  const data = useLoaderData<LoaderData>()
  const actionData = useActionData()
  const navigate = useNavigate()

  const outputError = (errorMessage: string) => {
    return (
      <ErrorDiv>
        <em>{errorMessage}</em>
        <br />
      </ErrorDiv>
    )
  }

  const centered = [`flex`, `items-center`, `justify-center`, `flex-col`]

  return (
    <div>
      <ModalBackdrop onClick={() => navigate(`/trips/${params.tripId}/edit`)} />
      <Modal className={join(...centered)}>
        <div
          className={join(`pt-2`)}
          onClick={() => navigate(`/trips/${params.tripId}/edit`)}
        >
          <SvgSwipeButton />
        </div>

        <AddButtonText className={join(`mr-48`, `p-8`)}>
          Add Traveler
        </AddButtonText>
        <Form method="post">
          <div className={join(`text-center`, `my-5`)}>
            <input type="hidden" name="tripId" value={data.trip.id} />
            <InputLabel>
              User Email:
              <InputField
                type="text"
                name="email"
                className={join(`mx-auto`, `block`, `mt-xl`)}
                //margin-top: 10em
              />
            </InputLabel>
            <br />

            {actionData?.tripId && outputError(actionData.tripId)}
            {actionData?.user && outputError(actionData.user)}
            {actionData?.email && outputError(actionData.email)}

            <MainBtn type="submit">Add Attendee</MainBtn>
          </div>
        </Form>
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

export default NewAttendee
