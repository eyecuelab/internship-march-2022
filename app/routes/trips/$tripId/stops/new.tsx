import type { FC } from "react"

import type { ActionFunction } from "remix"
import { Outlet, Link, useActionData, redirect, Form, json } from "remix"

import invariant from "tiny-invariant"

import { SearchBar } from "~/styles/styledComponents"
import { formatUrl, join } from "~/utils"

export type ActionData = Awaited<ReturnType<typeof action>>

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const search = formData.get(`search`)
  invariant(search, `search must be defined`)
  const baseUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=`
  const key = `&key=` + process.env.MAP_API
  const formattedSearch = baseUrl + formatUrl(search.toString()) + key
  const data = await fetch(formattedSearch).then((result) => result.json())
  return json({ data })
}

const NewStop: FC = () => {
  const actionData = useActionData()
  return (
    <div
      className={join(
        `absolute`,
        `w-full`,
        `h-full`,
        `top-0`,
        `bg-[#2f3e46]`,
        `text-white`,
        `font-semibold`,
      )}
    >
      <div className={join(`flex`, `items-center`, `mt-10`)}>
        <Form method="post">
          <SearchBar
            name="search"
            placeholder="Add stop..."
            className={join(`h-[39px]`, `w-[80vw]`, `ml-3`)}
          />
        </Form>
        <Link to="../" className={join(`mx-auto`)}>
          Cancel
        </Link>
      </div>
      <Outlet context={actionData} />
    </div>
  )
}

export default NewStop
