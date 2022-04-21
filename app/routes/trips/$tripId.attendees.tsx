import type { FC } from "react"

import type { LoaderFunction } from "remix"
import {
  Link,
  json,
  Form,
  redirect,
  useActionData,
  useParams,
  useLoaderData,
} from "remix"

import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getTripById } from "~/models/trip.server"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (params: Params<string>) => {
  invariant(params.tripId, `trips required`)
  return await getTripById(params.tripId)
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.tripId, `trip id is required`)

  return json<LoaderData>(await getLoaderData(params))
}

const UserList: FC = () => {
  const data = useLoaderData<LoaderData>()

  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Attendees
      </h1>
      <Link
        to={`/trips/${data?.id}`}
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
        to="/profile/"
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
      <Link
        to="new/"
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
        Add New Attendee
      </Link>
    </div>
  )
}

export default UserList
