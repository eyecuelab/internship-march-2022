import type { FC } from "react"

import { Link, Outlet } from "remix"

import { join } from "~/utils"

const Stop: FC = () => {
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Stop Info
      </h1>
    </div>
  )
}

export default Stop
