import type { FC } from "react"

import type { ActionFunction } from "remix"
import { useActionData, redirect, Form, json } from "remix"

import invariant from "tiny-invariant"

import { createStop } from "~/models/stop.server"
import { RoundedRectangle, SearchBar } from "~/styles/styledComponents"
import { formatUrl, join } from "~/utils"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  console.log(`searching`)
  const search = formData.get(`search`)
  invariant(search, `search must be defined`)
  const baseUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=`
  const key = `&key=` + process.env.MAP_API
  const formattedSearch = baseUrl + formatUrl(search.toString()) + key
  const data = await fetch(formattedSearch).then((result) => result.json())
  console.log(data)
  return json({ data })
}

const NewStop: FC = () => {
  const actionData = useActionData()
  const data = actionData?.data
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Add Stop
      </h1>
      <Form method="post">
        <SearchBar name="search" placeholder="add stop..." />
        <button type="submit">Search</button>
      </Form>
      <ul>
        {data?.results?.map(
          (result: Record<string, number | string>, index: number) => (
            <li key={index}>
              <RoundedRectangle>
                <h1 className={join(`text-lg`, `m-1`)}>
                  {result.name},{` `}
                  <span className="ml-3">⭐: {result.rating}</span>
                </h1>
                <h1 className="text-base">{result.formatted_address}</h1>
              </RoundedRectangle>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}

export default NewStop
