import type { FC } from "react"

import { redirect } from "remix"
import type { ActionFunction } from "remix"

import invariant from "tiny-invariant"

import { createStop } from "~/models/stop.server"
import { join } from "~/utils"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  await createStop({})
  return redirect(`/trips`)
}

const NewStop: FC = () => {
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Add Stop
      </h1>
    </div>
  )
}

export default NewStop
