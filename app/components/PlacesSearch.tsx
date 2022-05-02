import { join } from "path"

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
type LocateType = {
  panTo: ({ lat, lng }: google.maps.LatLng) => void
}
const Search: FC<LocateType> = ({ panTo }) => {
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
            const pos = await getLatLng(results[0])
            const latlng = new google.maps.LatLng(pos.lat, pos.lng)
            panTo(latlng)
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

export default Search
