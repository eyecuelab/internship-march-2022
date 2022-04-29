import type { FC } from "react"

import { Link, json, useLoaderData, Outlet, useFetcher } from "remix"

import type { Item } from "@prisma/client"
import { useSubmit, useTransition } from "@remix-run/react"

import ReturnCheckBox from "./ReturnCheckBox"

type ItemProps = {
  item: Item
}
const PackingListItem: FC<ItemProps> = ({ item }) => {
  const fetcher = useFetcher()
  const submit = useSubmit()
  // const transition = useTransition()
  function handleChange(event: {
    currentTarget:
      | FormData
      | HTMLButtonElement
      | HTMLFormElement
      | HTMLInputElement
      | URLSearchParams
      | { [name: string]: string }
      | null
  }) {
    submit(event.currentTarget, { replace: true })
  }

  return (
    <li key={item.id}>
      <fetcher.Form method="post" onChange={handleChange}>
        <input type="hidden" name="id" value={item.id} />
        {item.description}
        <ReturnCheckBox isChecked={item.isChecked} key={item.id} />
        {/* {transition.state === `submitting` ? <p>Saving...</p> : null} */}
        {/* <button type="submit">✓</button> */}
      </fetcher.Form>
    </li>
  )
}

export default PackingListItem
