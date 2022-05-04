import React from "react"
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
import invariant from "tiny-invariant"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"

import PlacesSearch from "~/components/PlacesSearch"
import { getUpcomingTripByUserId } from "~/models/attendee.server"
import { requireUserId } from "~/session.server"
import mapStyles from "~/styles/mapStyles"
import SvgBullseye from "~/styles/SVGR/SVGBullseye"
import type { FormattedStop } from "~/utils"
import { formatStops, join } from "~/utils"

import NavBar from "./navbar"

const libraries: (
  | `drawing`
  | `geometry`
  | `localContext`
  | `places`
  | `visualization`
)[] = [`places`]
const mapContainerStyle = {
  width: `100vw`,
  height: `100vh`,
}
const center = {
  lat: 45.5152,
  lng: -122.6784,
}
// These need to be decided on as a team
const options = {
  styles: mapStyles,
  streetViewControl: false,
  zoomControl: false,
}
/* CONTROLS OPTIONS
disableDefaultUI: true,
  panControl: true,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  overviewMapControl: true,
  rotateControl: true
*/
type LocateType = {
  panTo: ({ lat, lng }: google.maps.LatLng) => void
}
type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  const apiKey = process.env.MAP_API
  const userId = await requireUserId(request)
  const upcomingTrip = await getUpcomingTripByUserId(userId)
  return {
    apiKey,
    upcomingTrip,
  }
}
export const loader: LoaderFunction = async ({ request, params }) => {
  return json<LoaderData>(await getLoaderData(request, params))
}

const Map: FC = () => {
  const data = useLoaderData()
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: data.apiKey,
    libraries: libraries,
  })

  const stops = data.upcomingTrip ? formatStops(data.upcomingTrip.stops) : null

  const mapRef: React.MutableRefObject<google.maps.Map | null> =
    React.useRef(null)
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])
  const panTo = React.useCallback((position: google.maps.LatLng) => {
    if (mapRef.current !== null) {
      mapRef.current.panTo(position)
      mapRef.current.setZoom(10)
    }
  }, [])

  if (loadError) return <h1>`Error loading maps`</h1>
  if (!isLoaded) return <h1>`Loading Maps`</h1>
  return (
    <div>
      <div className={join(`absolute`, `top-1.5`, `right-14`, `z-10`)}>
        <Locate panTo={panTo} />
      </div>
      <div
        className={join(
          `absolute`,
          `left-1/2`,
          `-translate-x-2/4`,
          `top-4`,
          `z-10`,
          `w-60`,
        )}
      >
        <PlacesSearch panTo={panTo} />
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={stops ? stops[0].apiResult?.geometry.location : center}
        options={options}
        onLoad={onMapLoad}
      >
        {stops
          ? stops.map((s: FormattedStop) => (
              <Marker key={s.index} position={s.apiResult?.geometry.location} />
            ))
          : null}
      </GoogleMap>
      <NavBar />
    </div>
  )
}

const Locate: FC<LocateType> = ({ panTo }) => {
  return (
    <button
      onClick={() =>
        navigator?.geolocation.getCurrentPosition((position) => {
          const pos = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          )
          panTo(pos)
        })
      }
    >
      <SvgBullseye />
    </button>
  )
}
export default Map
