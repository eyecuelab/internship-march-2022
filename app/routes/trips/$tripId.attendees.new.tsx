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
} from "remix"

import { useCatch } from "@remix-run/react"
import invariant from "tiny-invariant"

import { createAttendee } from "~/models/attendee.server"
import type { Trip } from "~/models/trip.server"
import { getTripById } from "~/models/trip.server"
import { getUserByEmail } from "~/models/user.server"
import { join, validateEmail } from "~/utils"

import {
  MainBtn,
  InputField,
  InputLabel,
  Header,
  ErrorDiv,
} from "../../styles/styledComponents"

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
  return redirect(`/trips`)
}

const NewAttendee: FC = () => {
  const data = useLoaderData<LoaderData>()
  const actionData = useActionData()

  const outputError = (errorMessage: string) => {
    return (
      <ErrorDiv>
        <em>{errorMessage}</em>
        <br />
      </ErrorDiv>
    )
  }

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
      <Header>Add New Attendee</Header>
      <Form method="post">
        <div className={join(`text-center`, `my-5`)}>
          <input type="hidden" name="tripId" value={data.trip.id} />
          <InputLabel>
            User Email:
            <InputField
              type="text"
              name="email"
              className={join(`mx-auto`, `block`)}
            />
          </InputLabel>
          <br />

          {actionData?.tripId && outputError(actionData.tripId)}
          {actionData?.user && outputError(actionData.user)}
          {actionData?.email && outputError(actionData.email)}

          <MainBtn type="submit">Add Attendee</MainBtn>
        </div>
      </Form>

      <Link to="/trips/trip-id-goes-here/" className={join(...linkStyles)}>
        Return to trip dashboard
      </Link>
      <Link to="/trips" className={join(...linkStyles)}>
        Return to trips
      </Link>
      <Link to="/profile" className={join(...linkStyles)}>
        Return to profile
      </Link>
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
