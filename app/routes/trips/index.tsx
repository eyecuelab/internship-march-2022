import type { FC } from "react"

import { Link } from "remix"

import { join } from "~/utils"

const Index: FC = () => {
  return (
    <div>
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
    </div>
  )
}

export default Index
