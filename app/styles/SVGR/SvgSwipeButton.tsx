import * as React from "react"
import type { FC } from "react"

const SvgSwipeButton: FC = (props) => (
  <svg
    width={63}
    height={4}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      stroke="#CAD2C5"
      strokeWidth={3}
      strokeLinecap="round"
      d="M1.87 1.522h59.26"
    />
  </svg>
)

export default SvgSwipeButton
