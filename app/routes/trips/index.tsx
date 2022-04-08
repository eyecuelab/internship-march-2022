import type { FC } from "react"

import { Link, json, useLoaderData } from "remix"

import type { Trip } from "@prisma/client"
import { data } from "msw/lib/types/context"

import { getTrips } from "~/models/trip.server"
import { join } from "~/utils"

type LoaderData = {
  trips: Awaited<ReturnType<typeof getTrips>>
}

export const loader = async () => {
  return json<LoaderData>({
    trips: await getTrips(),
  })
}

const Index: FC = () => {
  const { trips } = useLoaderData() as LoaderData
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Trips List
      </h1>
      <ul>
        {trips.map((trip: Trip) => (
          <li key={trip.id}>
            <Link
              to={trip.id}
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
              {trip.nickName}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to="/trips/new/"
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
        Create Trip
      </Link>
      <Link
        to="/trips/trip-id-goes-here"
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
        Example Trip
      </Link>
    </div>
  )
}

export default Index
//outlet
