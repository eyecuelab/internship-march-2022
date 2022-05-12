import type { FC } from "react"

import { Link, json, useLoaderData, Outlet, useFetcher } from "remix"

import type { Item } from "@prisma/client"
import { useSubmit, useTransition } from "@remix-run/react"

import {
  RoundedRectangle,
  WhiteRoundedRectangle,
  BottomLineDiv,
  TitleText,
  TitleTextDark,
} from "~/styles/styledComponents"
import SvgCheckCircle from "~/styles/SVGR/SvgCheckCircle"
import { join, MAX_FORM_LENGTH } from "~/utils"

import ReturnCheckBox from "./ReturnCheckBox"

type ItemProps = {
  item: Item
}
const PackingListItem: FC<ItemProps> = ({ item }) => {
  const fetcher = useFetcher()
  // const submit = useSubmit()

  const titleDivStyles = [`text-left`, `flex`, `justify-between`]
  if (item.isChecked !== true) {
    return (
      <li key={item.id}>
        <RoundedRectangle className="class=flex justify-between">
          <fetcher.Form method="post">
            <input
              maxLength={MAX_FORM_LENGTH}
              type="hidden"
              name="id"
              value={item.id}
            />
            <BottomLineDiv className="hover:delay-0 transition delay-150 duration-300">
              <div className="... flex justify-between">
                <TitleText>{item.description}</TitleText>
                <button type="submit" aria-label="check circle">
                  <ReturnCheckBox isChecked={item.isChecked} key={item.id} />
                </button>
              </div>
            </BottomLineDiv>
          </fetcher.Form>
        </RoundedRectangle>
      </li>
    )
  }

  return (
    <li key={item.id} className={join(`mx-6`)}>
      <WhiteRoundedRectangle>
        <div className="flex w-full px-7 py-4 ">
          <fetcher.Form method="post" className="w-full justify-between">
            <input type="hidden" name="id" value={item.id} />
            <div className={join(...titleDivStyles)}>
              <TitleTextDark>{item.description}</TitleTextDark>
              <button type="submit" aria-label="check circle">
                <ReturnCheckBox isChecked={item.isChecked} key={item.id} />
              </button>
            </div>
          </fetcher.Form>
        </div>
      </WhiteRoundedRectangle>
    </li>
  )
}

export default PackingListItem

// const PackingListItem: FC<ItemProps> = ({ item }) => {
//   const fetcher = useFetcher()
//   const submit = useSubmit()

//   const titleDivStyles = [`text-left`, `flex`, `justify-between`]
//   if (item.isChecked === true) {
//     return (
//       <div>
//         <li key={item.id} className={join(`mx-6`)}>
//           <WhiteRoundedRectangle>
//             <div className="flex w-full px-7 py-4 ">
//               <fetcher.Form method="post" className="w-full justify-between">
//                 <input type="hidden" name="id" value={item.id} />
//                 <div className={join(...titleDivStyles)}>
//                   <TitleTextDark>{item.description}</TitleTextDark>
//                   <button
//                     type="submit"
//                     display="inline"
//                     aria-label="check circle"
//                   >
//                     <ReturnCheckBox isChecked={item.isChecked} key={item.id} />
//                   </button>
//                 </div>
//                 {/* {transition.state === `submitting` ? <p>Saving...</p> : null} */}
//                 {/* <button type="submit">✓</button> */}
//               </fetcher.Form>
//             </div>
//           </WhiteRoundedRectangle>
//         </li>
//       </div>
//     )
//   }
//   return (
//     <li key={item.id}>
//       <RoundedRectangle className="class=flex justify-between">
//         <fetcher.Form method="post">
//           <input type="hidden" name="id" value={item.id} />
//           <BottomLineDiv>
//             <div className="... flex justify-between">
//               <TitleText>{item.description}</TitleText>
//               <button type="submit" display="inline" aria-label="check circle">
//                 <ReturnCheckBox isChecked={item.isChecked} key={item.id} />
//               </button>
//             </div>
//           </BottomLineDiv>
//           {/* {transition.state === `submitting` ? <p>Saving...</p> : null} */}
//           {/* <button type="submit">✓</button> */}
//         </fetcher.Form>
//       </RoundedRectangle>
//     </li>
//   )
// }
