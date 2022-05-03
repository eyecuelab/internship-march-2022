import type { FC } from "react"

import SvgCheckCircle from "~/styles/SVGR/SvgCheckCircle"
import SvgSolidCircle from "~/styles/SVGR/SvgSolidCircle"
type ReturnCheckBoxProps = {
  isChecked: boolean
}
const ReturnCheckBox: FC<ReturnCheckBoxProps> = ({ isChecked }) => {
  if (isChecked === true) {
    return <SvgCheckCircle />
  }
  return <SvgSolidCircle />
}

export default ReturnCheckBox
