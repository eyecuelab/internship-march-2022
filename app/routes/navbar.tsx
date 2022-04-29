import { SlowBuffer } from "buffer"

import type { FC } from "react"
import { useState } from "react"

import NavButton from "~/components/NavButton"
import SvgHome from "~/styles/SVGR/SvgHome"
import SvgMap from "~/styles/SVGR/SvgMap"
import SvgProfile from "~/styles/SVGR/SvgProfile"
import SvgTrip from "~/styles/SVGR/SvgTrip"
import { join } from "~/utils"

const ROUTES = [
  {
    to: `/home`,
    Icon: SvgHome,
    text: `Home`,
  },
  {
    to: `/trips`,
    Icon: SvgTrip,
    text: `Trips`,
  },
  {
    to: `/map`,
    Icon: SvgMap,
    text: `Map`,
  },
  {
    to: `/profile`,
    Icon: SvgProfile,
    text: `Profile`,
  },
]

const NavBar: FC = () => {
  const centered = [`flex`, `items-center`, `justify-center`]
  const container = [
    `fixed`,
    `bottom-0`,
    `w-full`,
    `bg-[#2F3E46DE]`,
    `pt-2.5`,
    `pb-4`,
  ]

  return (
    <div className={join(...centered, ...container)}>
      {ROUTES.map((route) => {
        return (
          <NavButton
            key={route.to}
            to={route.to}
            Icon={route.Icon}
            text={route.text}
          />
        )
      })}
    </div>
  )
}

export default NavBar
