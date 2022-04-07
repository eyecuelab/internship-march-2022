import type { FC } from "react"

import { Link, useLoaderData, Form } from "remix"

import { join } from "~/utils"

const Index: FC = () => {
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Profile Home
      </h1>
      <Link
        to="/trips"
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
        Trips
      </Link>
      <Link
        to="/notes"
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
        Notes
      </Link>
      <Link
        to="/profile/edit"
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
        Edit Profile
      </Link>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className={join(
            `rounded`,
            `bg-slate-600`,
            `py-2`,
            `px-4`,
            `text-blue-100`,
            `hover:bg-blue-500`,
            `active:bg-blue-600`,
          )}
        >
          Logout
        </button>
      </Form>
    </div>
  )
}

export default Index
