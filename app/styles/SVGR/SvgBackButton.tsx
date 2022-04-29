import * as React from "react"
import type { FC } from "react"

const SvgBackButton: FC = (props) => (
  <svg
    width={8}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7 13 1 7l6-6"
      stroke="#E4EDDF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgBackButton
