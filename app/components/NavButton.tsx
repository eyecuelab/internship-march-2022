import React from "react"
import type { FC } from "react"

import { NavLink } from "remix"

import { NavButtonWrapper } from "~/styles/styledComponents"
import { join } from "~/utils"

type NavButtonProps = {
  to: string
  Icon: FC
  text: string
}

const NavButton: FC<NavButtonProps> = ({ to, Icon, text }) => {
  const buttonStyles = [`mx-4`, `w-full`, `h-full`]
  const activeStyle = [
    `bg-[#52796F]`,
    `text-white`,
    `flex`,
    `items-center`,
    `justify-center`,
    `p-2.5`,
    `rounded-lg`,
  ]
  const centered = [`flex`, `items-center`, `justify-center`]
  const sizing = [`py-3`, `px-24`]
  return (
    <NavButtonWrapper className={join(...buttonStyles)}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive ? join(...activeStyle) : join(...sizing)
        }
      >
        {({ isActive }) =>
          isActive ? (
            <div className={join(...centered)}>
              <Icon />
              <h1 className="ml-2">{text}</h1>
            </div>
          ) : (
            <Icon />
          )
        }
      </NavLink>
    </NavButtonWrapper>
  )
}

export default NavButton
