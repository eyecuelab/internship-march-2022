import * as React from "react"
import type { FC } from "react"

const SvgUserBeacon: FC = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="9.68661"
      cy="9.68661"
      r="9.68661"
      fill="#3EC3FF"
      fillOpacity="0.3"
    />
    <circle cx="9.68658" cy="9.68658" r="6.44183" fill="#3EC3FF" />
  </svg>
)

export default SvgUserBeacon
