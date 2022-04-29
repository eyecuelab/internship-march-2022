import type { FC } from "react"
type ReturnCheckBoxProps = {
  isChecked: boolean
}
const ReturnCheckBox: FC<ReturnCheckBoxProps> = ({ isChecked }) => {
  if (isChecked === true) {
    return <input type="checkbox" name="checkbox" checked />
  }
  return <input type="checkbox" name="checkbox" />
}

export default ReturnCheckBox
