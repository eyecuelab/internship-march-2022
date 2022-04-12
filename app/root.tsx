import type { FC } from "react"

import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import type { LinksFunction, MetaFunction, LoaderFunction } from "remix"

import { join } from "~/utils"

import { getUser } from "./session.server"
import ourStyles from "./styles/index.css"
import tailwindStylesheetUrl from "./styles/tailwind.css"

export const links: LinksFunction = () => {
  return [
    { rel: `stylesheet`, href: tailwindStylesheetUrl },
    { rel: `stylesheet`, href: ourStyles },
  ]
}

export const meta: MetaFunction = () => ({
  charset: `utf-8`,
  title: `Remix Notes`,
  viewport: `width=device-width,initial-scale=1`,
})

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  })
}

const App: FC = () => {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={join(`h-full`, `bg-[#2F3E46DE]`)}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default App
