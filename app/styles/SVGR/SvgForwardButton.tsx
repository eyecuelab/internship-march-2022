import * as React from "react"
import type { FC } from "react"

const SvgForwardButton: FC = (props) => (
  <svg
    width={8}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m1 13 6-6-6-6"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgForwardButton
