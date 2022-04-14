import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import { Link, json, Form, redirect, useActionData, useParams, useLoaderData } from "remix"

import invariant from "tiny-invariant"


import { Trip, getTrip } from "~/models/trip.server"
import { createAttendee } from "~/models/attendee.server"
import { getUserByEmail } from "~/models/user.server"
import { requireUserId } from "~/session.server"
import { join } from "~/utils"

 
type LoaderData = {
  trip: Trip;
};

export const loader: LoaderFunction = async ({
  params,
}) => {
  invariant(params.tripId, `params.id is required`);
  
  const trip = await getTrip(params.tripId);
  invariant(trip, `Trip not found: ${params.tripId}`);
  
  return json<LoaderData>({ trip });
};

type ActionData =
  | {
      tripIdInput: string | null
      email: string | null
      user: string | null
    }
  | undefined

export const action: ActionFunction = async ({ request }) => {
  const ownerId = await requireUserId(request)
  const formData = await request.formData()

  const tripIdInput = formData.get(`tripId`)
  const email = formData.get(`email`)!
  const tripId = tripIdInput ? tripIdInput.toString() : null
  const user = await getUserByEmail(email.toString())!
  const userId = user?.id
  
  const errors: ActionData = {
    tripIdInput: tripId ? null : "this tripId is not available",
    user: user ? null : `this person doesn't have an account yet`,
    email: email ? null : `email is required`,
  }
  // variable: whatToCheck ? ifCheckTrue : ifCheckFalse
  
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }
  invariant(typeof tripId === null, "Must have a valid trip id")
  invariant(typeof email === `string`, `email must be a string`)
  invariant(user, `user must have an account`)

  await createAttendee({ tripId, user.id })
  return redirect(`/trips`)
}

const NewAttendee: FC = () => {
  const data = useLoaderData() as LoaderData;
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Add New Attendee
      </h1>

      <Form method="post">
        <input type="hidden"
          name="tripId"
          value={data.trip.id}
        />
        <p>
          <label>
            User Email:{` `}
            {errors?.email ? (
              <em className="text-red-600">{errors.email}</em>
            ) : null}
            <input type="text" name="email" className={inputClassName} />
          </label>
        </p>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 
            text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          >
            Add User
          </button>
        </p>
      </Form>

      <Link
        to="/trips/trip-id-goes-here/"
        className={join(
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
        )}
      >
        Return to trip dashboard
      </Link>
      <Link
        to="/trips"
        className={join(
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
        )}
      >
        Return to trips
      </Link>
      <Link
        to="/profile"
        className={join(
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
        )}
      >
        Return to profile
      </Link>
    </div>
  )
}

export default NewAttendee
