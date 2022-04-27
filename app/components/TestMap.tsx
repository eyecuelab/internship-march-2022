import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { useLoaderData, json } from "remix"

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api"
import type { Params } from "react-router"

const libraries: (
  | `drawing`
  | `geometry`
  | `localContext`
  | `places`
  | `visualization`
)[] = [`places`]

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  console.log(process.env)
  const apiKey = process.env.REACT_APP_MAP_API
  return {
    apiKey: apiKey,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}

export const TestMap: FC = () => {
  const data = useLoaderData()
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: data.apiKey,
    libraries: libraries,
  })

  if (loadError) return <h1>`Error loading maps`</h1>
  if (!isLoaded) return <h1>`Loading Maps`</h1>
  return (
    <div>
      <GoogleMap></GoogleMap>
    </div>
  )
}
