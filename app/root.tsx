import type { FC } from "react"

import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
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

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request) => {
  return {
    user: await getUser(request),
    url: `https://maps.googleapis.com/maps/api/js?key=${process.env.MAP_API}&libraries=places&callback=initMap`,
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(await getLoaderData(request))
}

const App: FC = () => {
  const data = useLoaderData()
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        <script async src={data.url}></script>
        {typeof document === `undefined` ? `__STYLES__` : null}
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
