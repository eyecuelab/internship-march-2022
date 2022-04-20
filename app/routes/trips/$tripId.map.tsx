import type { FC } from "react"

import { Link, LoaderFunction, useLoaderData, json } from "remix"

import { join } from "~/utils"

import { Params } from "react-router-dom"



type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

const getLoaderData = async (request: Request, params: Params<string>) => {
  const url = `https://www.google.com/maps/embed/v1/view?zoom=10&center=45.5152%2C-122.6784&key=${process.env.REACT_APP_MAP_API}`
  console.log(process.env);

  return {
    url: url
    
  }
}

export const loader: LoaderFunction = async ({
  request,
  params
}) => {

  return json<LoaderData>(await getLoaderData(request, params))
}
const Map: FC = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1 className={join(`flex`, `items-center`, `justify-center`)}>Map</h1>
      <Link
        to="/trips/trip-id-goes-here/"
        className={join(
          `flex`,
          `items-center`,
          `justify-center`,
          `rounded-md`,
          `border`,
          `border-transparent`,
          `bg-white`,
          `px-4`,
          `py-3`,
          `text-base`,
          `font-medium`,
          `text-yellow-700`,
          `shadow-sm`,
          `hover:bg-yellow-50`,
          `sm:px-8`,
        )}
      >
        Return to trip dashboard
      </Link>
      <Link
        to="/profile"
        className={join(
          `flex`,
          `items-center`,
          `justify-center`,
          `rounded-md`,
          `border`,
          `border-transparent`,
          `bg-white`,
          `px-4`,
          `py-3`,
          `text-base`,
          `font-medium`,
          `text-yellow-700`,
          `shadow-sm`,
          `hover:bg-yellow-50`,
          `sm:px-8`,
        )}
      >
        Return to profile
      </Link>
      <iframe 
      width="600"
      height="450"
      loading="lazy"
      src={data.url}
      >
      </iframe>
    </div>
  )
}

export default Map
