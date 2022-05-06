import type { FC } from "react"

import type { ActionFunction } from "remix"
import { Link, json, Form, redirect, useActionData } from "remix"

import invariant from "tiny-invariant"

import { createAttendee } from "~/models/attendee.server"
import { createDecider } from "~/models/decider.server"
import { createTrip, updateTrip } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { join } from "~/utils"

type ActionData =
  | {
      nickName: string | null
    }
  | undefined

export const action: ActionFunction = async (request: Request) => {
  const ownerId = await requireUserId(request)
  const formData = await request.formData()

  const nickName = formData.get(`nickName`)

  const errors: ActionData = {
    nickName: nickName ? null : `nickName is required`,
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  invariant(typeof nickName === `string`, `nickName must be a string`)

  const trip = await createTrip({ nickName, ownerId })

  const tripId = trip.id
  const userId = ownerId
  await createAttendee({ tripId, userId })
  const decider = await createDecider({ tripId })
  invariant(decider, `decider not created successfully`)
  await updateTrip(tripId, decider.id)
  return redirect(`/trips`)
}

const NewTrip: FC = () => {
  const errors = useActionData()
  const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`

  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        New Trip Form
      </h1>
      <Form method="post">
        <p>
          <label>
            Name Your Trip:{` `}
            {errors?.nickName ? (
              <em className="text-red-600">{errors.nickName}</em>
            ) : null}
            <input type="text" name="nickName" className={inputClassName} />
          </label>
        </p>
        <p className="text-right">
          <button type="submit">Create Trip</button>
        </p>
      </Form>
    </div>
  )
}

export default NewTrip
