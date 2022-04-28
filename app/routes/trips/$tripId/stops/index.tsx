import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Link, useLoaderData, json } from "remix"

import type { Params } from "react-router"

import { TestMap } from "~/components/TestMap"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  console.log(process.env)
  const apiKey = process.env.MAP_API
  return {
    apiKey: apiKey,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}

const Stops: FC = () => {
  const data = useLoaderData()
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>
        Stops List
      </h1>
      <TestMap />
      <Link to="new">Add Stop</Link>
    </div>
  )
}

export default Stops
