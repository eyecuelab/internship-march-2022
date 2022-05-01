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
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"

import mapStyles from "~/styles/mapStyles"

const libraries: (
  | `drawing`
  | `geometry`
  | `localContext`
  | `places`
  | `visualization`
)[] = [`places`]
const mapContainerStyle = {
  width: `90vw`,
  height: `90vh`,
}
const center = {
  lat: 45.5152,
  lng: -122.6784,
}
const options = {
  styles: mapStyles,
  disableDefaultUI: true, //This disables ALL base Ui, we can add back in individually what we want
  zoomControl: true,
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
export const TestMap: FC = () => {
  const data = useLoaderData()
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: data.apiKey,
    libraries: libraries,
  })

  const mapRef = React.useRef()
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map
  }, [])
  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(10)
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

function Locate({ panTo }) {
  return (
    <button
      onClick={() =>
        navigator?.geolocation.getCurrentPosition((position) => {
          panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        })
      }
      className={join(`right-0`)}
    >
      PAN TO MY LOCATION
    </button>
  )
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 45.5152, lng: () => -122.6784 },
      radius: 200 * 1000,
    },
  })

  return (
    <div
      className={join(
        `absolute`,
        `top-4`,
        `left-2/4`,
        `w-full`,
        `max-w-{400px}`,
        `z-10`,
      )}
    >
      <Combobox
        onSelect={async (address) => {
          setValue(address, false)
          clearSuggestions()

          try {
            const results = await getGeocode({ address })
            const { lat, lng } = await getLatLng(results[0])
            panTo({ lat, lng })
          } catch (error) {
            console.log(error)
          }
        }}
      >
        <ComboboxInput
          className={join(`w-full`, `p-2`)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === `OK` &&
              data.map(({ description }, index) => (
                <ComboboxOption key={index} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  )
}
