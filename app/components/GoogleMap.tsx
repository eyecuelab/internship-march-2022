import { join } from "path"

import React from "react"
import type { FC } from "react"

import type { LinksFunction, LoaderFunction } from "remix"
import { useLoaderData, json } from "remix"

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"
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

import mapStyles from "~/styles/mapStyles"

import Search from "./PlacesSearch"

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
const options = {
  styles: mapStyles,
  //This disables ALL base Ui, we can add back in individually what we want
  // disableDefaultUI: true,
  // zoomControl: true,
}
/* CONTROLS OPTIONS
  panControl: true,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  overviewMapControl: true,
  rotateControl: true
*/
export const links: LinksFunction = () => {
  return [
    {
      rel: `stylesheet`,
      href: `@reach/combobox/styles.css`,
    },
  ]
}
const TestMap: FC = () => {
  const data = useLoaderData()
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: data.apiKey,
    libraries: libraries,
  })

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
      <Locate panTo={panTo} />
      <Search panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onLoad={onMapLoad}
      />
    </div>
  )
}
type LocateType = {
  panTo: ({ lat, lng }: google.maps.LatLng) => void
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
      className={join(`right-0`)}
    >
      PAN TO MY LOCATION
    </button>
  )
}
export default TestMap
