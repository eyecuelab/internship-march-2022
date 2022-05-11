import { link } from "fs"

import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Link, Outlet, NavLink, json, useLoaderData } from "remix"

import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeesByTripId } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { getUserId } from "~/session.server"
import {
  Header,
  TripNav,
  TripDashboardImg,
  TitleText,
} from "~/styles/styledComponents"
import SvgCloseCircle from "~/styles/SVGR/SvgCloseCircle"
import SvgCloseCircleWhite from "~/styles/SVGR/SvgCloseCircleWhite"
import SvgHamburger from "~/styles/SVGR/SvgHamburger"
import { formatTrip, join } from "~/utils"

import AttendeesLayout from "./$tripId/attendees"
import StopsLayout from "./$tripId/stops"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

export const loader: LoaderFunction = async ({ request, params }) => {
  return json(await getLoaderData(request, params))
}
const getLoaderData = async (request: Request, params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `must have tripId`)
  const tempTrip = await getTripById(tripId)
  const attendees = await getAttendeesByTripId(tripId)
  invariant(tempTrip, `need tripId`)
  const trip = formatTrip(tempTrip)
  invariant(attendees, `need attendeesId`)
  const userId = await getUserId(request)
  invariant(userId, `id is required`)
  return { trip, attendees, userId }
}

const TripDetails: FC = () => {
  const data = useLoaderData<LoaderData>()
  const photoSrc = `/img/trip-dashboard.jpg`
  const baseStyle = [`text-black`, `text-[14px]`, `py-3`, `px-14`, `mx-auto`]
  const activeStyle = [
    `bg-[#E4EDDF]`,
    `rounded-xl`,
    `text-opacity-100`,
    `font-bold`,
  ]
  const inactiveStyle = [`text-opacity-50`]
  const containerStyle = [`m-1`, `mx-auto`, `w-max`, `h-max`]
  const centered = [`flex`, `items-center`, `justify-center`]
  return (
    <>
      <TripDashboardImg />
      <div>
        <Link to="home" className={join(`fixed`, `top-2`, `left-1`, `p-4`)}>
          <SvgCloseCircleWhite />
        </Link>

        {data.trip.ownerId === data.userId ? (
          <Link to="edit" className={join(`fixed`, `top-2`, `right-2`, `p-4`)}>
            <SvgHamburger />
          </Link>
        ) : null}

        <div className={join(`mx-8`, `z-10`)}>
          <Header className={join(`ml-10`, `mr-auto`, `mt-10`)}>
            Your Trip to {data.trip.nickName}
          </Header>
          <TripNav className={join(...centered)}>
            <NavLink
              to="attendees/"
              className={({ isActive }) =>
                isActive
                  ? join(...baseStyle, ...activeStyle)
                  : join(...baseStyle, ...inactiveStyle)
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="stops?index"
              className={({ isActive }) =>
                isActive
                  ? join(...baseStyle, ...activeStyle)
                  : join(...baseStyle, ...inactiveStyle)
              }
            >
              Stops
            </NavLink>
          </TripNav>
          <Outlet />
        </div>
      </div>
    </>
  )
}
//to: `/home`,

// index.tsx --> Overview / Stops

export default TripDetails
