/* eslint-disable prettier/prettier */
import type { FocusEvent, FC } from "react"

import { redirect, Form, Link, json, useActionData, useLoaderData } from "remix"
import type { ActionFunction, LoaderFunction } from "remix"

import type { Item, Attendee, User, Trip } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeeById} from "~/models/attendee.server"
import { createItem } from "~/models/item.server"
import { requireUserId } from "~/session.server"
import { join } from "~/utils"

const inputClassName = `join(
  flex
  items-center
  justify-center
  rounded-md
  border
  border-transparent
  bg-white
  px-4
  py-3
  text-base
  font-medium
  text-yellow-700
  shadow-sm
  hover:bg-yellow-50
  sm:px-8
)`

type ActionData =
  | {
    description: string | null
    userId: string | null
    tripId: string | null
  }
  | undefined

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request,params: Params<string>) => {
  // eslint-disable-next-line prefer-destructuring
  const userId = await requireUserId(request)
  // eslint-disable-next-line prefer-destructuring
  const tripId = params.tripId
  invariant(userId, `need userId`)
  invariant(tripId, `need tripId`)
  return await json(getAttendeeById(tripId, userId))
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json(await getLoaderData(request, params))
}

export const action: ActionFunction = async ({ request, params }) => {
  // eslint-disable-next-line prefer-destructuring
  const userId = await requireUserId(request)
  // eslint-disable-next-line prefer-destructuring
  const tripId = params.tripId
  const formData = await request.formData()
  const description = formData.get(`description`)

  const errors: ActionData = {
    description: description ? null : `Item description is required.`,
    tripId: description ? null : `tripId is required.`,
    userId: description ? null : `userId is required.`,
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  invariant(typeof description === `string`, `description must be a string`)
  // invariant(typeof userId === `string`, `userId must be a string`)
  invariant(typeof tripId === `string`, `tripId must be a string`)

  await createItem({ description, tripId, userId })

  return redirect(`/trips/${tripId}/packing-list/`)
}

const AddItem: FC = () => {
  const errors = useActionData()
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Add Item
      </h1>

      <Form method="post">
        <p>
          <label>
            Item Description:{` `}
            {errors?.description ? (
              <em className="text-red-600">{errors.description}</em>
            ) : null}
            <input type="text" name="description" className={inputClassName} />
          </label>
        </p>
        <p>
          <button type="submit" className={inputClassName}>
            Add Item
          </button>
        </p>
      </Form>
    </div>
  )
}

export default AddItem