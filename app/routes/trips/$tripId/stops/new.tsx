import type { FC } from "react"

import { redirect, Form } from "remix"
import type { ActionFunction } from "remix"

import invariant from "tiny-invariant"

import { createStop } from "~/models/stop.server"
import { SearchBar } from "~/styles/styledComponents"
import { join } from "~/utils"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const search = formData.get(`search`)
  let map: google.maps.Map
  const center: google.maps.LatLngLiteral = { lat: 30, lng: -110 }
  return redirect(`/trips`)
}

const NewStop: FC = () => {
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Add Stop
      </h1>
      <Form>
        <SearchBar placeholder="add stop..." />
      </Form>
    </div>
  )
}

export default NewStop
