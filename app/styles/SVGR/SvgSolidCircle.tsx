import type { FC } from "react"

const SvgSolidCircle: FC = (props) => (
  <svg
    width={10}
    height={10}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 
      114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z"
      fill="#E4EDDF"
    />
  </svg>
)

export default SvgSolidCircle
