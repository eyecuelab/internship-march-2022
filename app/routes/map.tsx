import type { FC } from "react"
import { useEffect } from "react"

import type { LoaderFunction } from "remix"
import { Link, useLoaderData, json } from "remix"

import { Navigator } from "node-navigator"
import type { Params } from "react-router-dom"
import type { Position } from "vitest"

import { join } from "~/utils"

import NavBar from "./navbar"

// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     (position: GeolocationPosition) => {
//       const pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };

//       infoWindow.setPosition(pos);
//       infoWindow.setContent("Location found.");
//       infoWindow.open(map);
//       map.setCenter(pos);
//     },
//     () => {
//       handleLocationError(true, infoWindow, map.getCenter()!);
//     }
//   );
// } else {
//   // Browser doesn't support Geolocation
//   handleLocationError(false, infoWindow, map.getCenter()!);
// }
// });

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  const apiKey = process.env.REACT_APP_MAP_API
  return {
    apiKey: apiKey,
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}
const Map: FC = () => {
  const data = useLoaderData<LoaderData>()
  const navigator = new Navigator()
  const pos = {
    lat: 0,
    lng: 0,
  }
  const updatePosition = (position: any) => {
    pos.lat = position.latitude
    pos.lng = position.longitude
  }
  const setPosition = (position: any) => {
    updatePosition(position)
  }
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition)
    } else {
      //do literally anything if you cant get the location
    }
  }
  getLocation()

  const url = `https://www.google.com/maps/embed/v1/view?zoom=10&center=${pos.lat}%2C${pos.lng}&key=${data.apiKey}`
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
      <iframe width="600" height="450" loading="lazy" src={url}></iframe>
      <NavBar />
    </div>
  )
}

export default Map
