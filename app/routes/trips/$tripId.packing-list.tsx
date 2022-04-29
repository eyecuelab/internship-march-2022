import type { FC } from "react"

import type { LoaderFunction, ActionFunction } from "remix"
import { Link, json, useLoaderData, Outlet, useFetcher } from "remix"

import type { Item } from "@prisma/client"
import { useSubmit, useTransition } from "@remix-run/react"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import PackingListItem from "~/components/PackingListItem"
import { getAttendeeById } from "~/models/attendee.server"
import { getItemById, updateChecked } from "~/models/item.server"
import { requireUserId } from "~/session.server"
import { RoundedRectangle } from "~/styles/styledComponents"
import { join } from "~/utils"

//---------------------------Loader

// setting a type to loaderData, which will be the same as typeof getLoaderData
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

// jsonifies the getLoaderData return after it returns, instantiates the loader function
export const loader: LoaderFunction = async ({ request, params }) => {
  return json(await getLoaderData(request, params))
}

// pass in Request as a get request from server, pass in params as a way to parse out data from url
const getLoaderData = async (request: Request, params: Params<string>) => {
  // eslint-disable-next-line prefer-destructuring
  const userId = await requireUserId(request)
  // eslint-disable-next-line prefer-destructuring
  const tripId = params.tripId
  invariant(userId, `need userId`)
  invariant(tripId, `need tripId`)

  // this function is defined in the attendee server logic file, will return an object
  return getAttendeeById(tripId, userId)
}

//---------------------------Action

// actions are used for post, put, patch, and delete requests
// this action function is getting
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const itemId = form.get(`id`)?.toString()
  invariant(itemId, `itemId must exist`)
  const item = await getItemById(itemId)
  invariant(item, `item must not be null`)
  const itemCheckedStatus = item.isChecked
  return updateChecked(item.id, !itemCheckedStatus)
}

//---------------------------FC

const PackingList: FC = () => {
  const data = useLoaderData<LoaderData>()
  const checkedItems = data?.packingList.filter(
    (item: Item) => item.isChecked === true,
  )
  const uncheckedItems = data?.packingList.filter(
    (item: Item) => item.isChecked !== true,
  )
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Packing List
      </h1>
      <Outlet />

      <h3>UnChecked Items</h3>
      <RoundedRectangle>
        <ul>
          {uncheckedItems?.map((item: Item) => (
            <PackingListItem item={item} key={item.id} />
          ))}
        </ul>
      </RoundedRectangle>
      <h3>Checked Items</h3>
      <RoundedRectangle>
        <ul>
          {checkedItems?.map((item: Item) => (
            <PackingListItem item={item} key={item.id} />
          ))}
        </ul>
      </RoundedRectangle>

      <Link to="/trips/trip-id-goes-here" className={inputClassName}>
        Return to trip dashboard
      </Link>
      <Link
        to={`/trips/${data?.tripId}/packing-list/new`}
        className={inputClassName}
      >
        Add Item
      </Link>
      <Link to="/profile" className={inputClassName}>
        Return to profile
      </Link>
    </div>
  )
}

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

export default PackingList
