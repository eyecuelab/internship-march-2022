import type { FC } from "react"

import { Link, Outlet, NavLink, json, useLoaderData } from "remix"
import type { LoaderFunction } from "remix"

import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeesByTripId } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { TitleText, Avatar } from "~/styles/styledComponents"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

export const loader: LoaderFunction = async ({ request, params }) => {
  return json(await getLoaderData(request, params))
}
const getLoaderData = async (request: Request, params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `must have tripId`)
  const trip = getTripById(tripId)
  const attendees = await getAttendeesByTripId(tripId)

  invariant(attendees, `need attendeesId`)
  return { trip, attendees }
  // console.log(getTripById)
}

// tripId, attendees,start and end dates, start and end location, stops[]

const AttendeesLayout: FC = () => {
  const data = useLoaderData<LoaderData>()

  console.log(data)
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
  const defaultAvatar = `public/img/default-avatar.jpg`
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `text-left`, `flex-1`]

  return (
    <div>
      <div>
        <TitleText>
          <span className={join(`ml-8`)}>Travelers</span>
        </TitleText>
        <ul>
          {data.attendees.map((attendee) => (
            <li key={attendee.user.id + attendee.user.id}>
              <span className={join(...avatarDivStyles)}>
                <Avatar src={attendee.user.avatarUrl || defaultAvatar} />
              </span>
              <span className={join(...titleDivStyles)}>
                <TitleText> {attendee.user.userName}</TitleText>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
      <Link to="edit/" className={join()}>
        Edit
      </Link>
      <Link to="packing-list/" className={join(...linkStyles)}>
        Packing List
      </Link>
      <Link to="expenses/" className={join(...linkStyles)}>
        Expenses
      </Link>
      <Link to="decider/" className={join(...linkStyles)}>
        Decider
      </Link>
    </div>
  )
}

export default AttendeesLayout
