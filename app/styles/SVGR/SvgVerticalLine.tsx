import * as React from "react"
import type { FC } from "react"

const SvgVerticalLine: FC = (props) => (
  <svg
    width={1}
    height={74}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path stroke="#fff" strokeOpacity={0.19} d="M.5 0v74" />
  </svg>
)

export default SvgVerticalLine
