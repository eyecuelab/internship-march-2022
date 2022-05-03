import * as React from "react"
import type { FC } from "react"

const SvgEndpoint: FC = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="8" cy="8" r="8" fill="#FF5E03" />
  </svg>
)

export default SvgEndpoint
