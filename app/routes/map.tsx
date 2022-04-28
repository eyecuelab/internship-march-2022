import type { FC } from "react"
import { useState, useEffect } from "react"

import type { LoaderFunction } from "remix"
import { Link, useLoaderData, json, redirect, Form } from "remix"

import { Navigator } from "node-navigator"
import type { Params } from "react-router-dom"
import { Position } from "vitest"

import SvgSearchIcon from "~/styles/SVGR/SearchIcon"
import { join } from "~/utils"

import { MapInputField } from "../styles/styledComponents"
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
  const [position, setPosition] = useState({
    lat: 45.523064,
    lng: -122.676483,
  })
  const data = useLoaderData<LoaderData>()

  const geolocationCallback: PositionCallback = (geolocationObj) => {
    console.log(`geolocationObj`, geolocationObj)
    setPosition({
      lat: geolocationObj.coords.latitude,
      lng: geolocationObj.coords.longitude,
    })
  }

  const errorCallback: PositionErrorCallback = (error) => {
    console.log(`error`, error)
  }

  useEffect(() => {
    // Set a listener for the geolocation when the component mounts
    const watchId = navigator?.geolocation.watchPosition(
      geolocationCallback,
      errorCallback,
    )

    // When the component unmounts, clear the listener with the cleanup method
    return () => {
      navigator?.geolocation.clearWatch(watchId)
    }
  }, [])

  const url = `https://www.google.com/maps/embed/v1/view?zoom=10&center=${position.lat}%2C${position.lng}&key=${data.apiKey}`

  const width = window?.innerWidth
  const height = window?.innerHeight

  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>Map</h1>
      <Link
        to="/trips/trip-id-goes-here/"
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
        Return to trip dashboard
      </Link>
      <Link
        to="/profile"
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
        Return to profile
      </Link>
      <Form method="post">
        <div className={join(`relative`)}>
          <MapInputField
            className={join(`w-full`, `h-full`, `absolute`)}
            placeholder="Search..."
          />
          {/* <div className={join(`absolute`, `top-0`)}>
            <SvgSearchIcon />
          </div> */}
        </div>
      </Form>
      <iframe width={width} height={height} loading="lazy" src={url}></iframe>
      <NavBar />
    </div>
  )
}

export default Map
