import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Link, useLoaderData, json } from "remix"

import type { Params } from "react-router-dom"

import TestMap from "~/components/GoogleMap"

import NavBar from "./navbar"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  const apiKey = process.env.MAP_API
  return {
    apiKey: apiKey,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}
const Map: FC = () => {
  return (
    <div>
      <TestMap />
      <NavBar />
    </div>
  )
}

export default Map
