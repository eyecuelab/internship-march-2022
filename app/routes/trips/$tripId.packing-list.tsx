import type { FC } from "react"

import { Link, json, useLoaderData } from "remix"
import type { LoaderFunction } from "remix"

import type { Item } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeeById } from "~/models/attendee.server"
import { getUserId, requireUserId } from "~/session.server"
import { MainBtn, RoundedRectangle } from "~/styles/styledComponents"
import { join } from "~/utils"

const inputClassName = `join(
  flex
  items-center
  justify-center
  rounded-md
  border
  border-transparent
  bg-white
  px-4
  py-3
  text-base
  font-medium
  text-yellow-700
  shadow-sm
  hover:bg-yellow-50
  sm:px-8
)`

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  // eslint-disable-next-line prefer-destructuring
  const userId = await requireUserId(request)
  // eslint-disable-next-line prefer-destructuring
  const tripId = params.tripId
  invariant(userId, `need userId`)
  invariant(tripId, `need tripId`)

  return getAttendeeById(tripId, userId)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json(await getLoaderData(request, params))
}

const PackingList: FC = () => {
  const data = useLoaderData<LoaderData>()
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Packing List
      </h1>
    </div>
  )
}

export default PackingList
