import * as React from "react"
import type { FC } from "react"

const SvgHorizontalLine: FC = (props) => (
  <svg
    width={291}
    height={1}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path stroke="#fff" strokeOpacity={0.19} d="M.395.5h290.21" />
  </svg>
)

export default SvgHorizontalLine
