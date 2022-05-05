import type { FC } from "react"

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox"
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete"

import { MapInputField } from "~/styles/styledComponents"
import { join } from "~/utils"
type LocateType = {
  panTo: ({ lat, lng }: google.maps.LatLng) => void
}
const PlacesSearch: FC<LocateType> = ({ panTo }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: new google.maps.LatLng(45.5152, 122.6784),
      radius: 200 * 1000,
    },
  })

  return (
    <div className={join(`w-full`)}>
      <Combobox
        className={join(`w-full`)}
        onSelect={async (address) => {
          setValue(address, false)
          clearSuggestions()

          try {
            const results = await getGeocode({ address })
            const pos = await getLatLng(results[0])
            const latlng = new google.maps.LatLng(pos.lat, pos.lng)
            panTo(latlng)
          } catch (error) {
            console.log(error)
          }
        }}
      >
        <MapInputField
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

export default PlacesSearch
