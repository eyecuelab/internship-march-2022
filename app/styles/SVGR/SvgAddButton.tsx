import * as React from "react"
import type { FC } from "react"

const SvgAddButton: FC = (props) => (
  <svg
    width={11}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.333 1.735v8.667M1 6.068h8.667"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgAddButton
