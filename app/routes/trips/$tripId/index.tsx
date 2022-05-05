import { link } from "fs"

import type { FC } from "react"

import { Link, Outlet, NavLink } from "remix"

import { join } from "~/utils"

import AttendeesLayout from "./attendees"

const TripIndex: FC = () => {
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
      <Link to="/home" className={join(...linkStyles)}>
        X asdfasdfs
      </Link>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Trip name goes here
      </h1>
      {/* <NavLink>
        <AttendeesLayout />
      </NavLink> */}
      <Outlet />
    </div>
  )
}
//to: `/home`,

// index.tsx --> Overview / Stops

export default TripIndex
