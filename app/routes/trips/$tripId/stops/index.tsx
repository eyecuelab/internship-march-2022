import type { FC } from "react"

import { Link } from "remix"

import { join } from "~/utils"

const Stops: FC = () => {
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Stops List
      </h1>
      <Link to="new">Add Stop</Link>
    </div>
  )
}

export default Stops
