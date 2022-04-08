import type { FC } from "react"

import type { ActionFunction } from "remix"
import { Link, json, Form, redirect, useActionData } from "remix"

import invariant from "tiny-invariant"

import { createTrip } from "~/models/trip.server"
import { requireUserId } from "~/session.server"
import { join } from "~/utils"

type ActionData =
  | {
      nickName: string | null
    }
  | undefined

export const action: ActionFunction = async ({ request }) => {
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

  await createTrip({ nickName, ownerId })
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
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 
            text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          >
            Create Trip
          </button>
        </p>
      </Form>
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

export default NewTrip
