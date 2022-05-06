import type { FC } from "react"
import { useEffect } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import {
  redirect,
  Form,
  Link,
  json,
  useLoaderData,
  useParams,
  useActionData,
  useSubmit,
} from "remix"

import { Decider, Attendee, Trip } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeeNames } from "~/models/attendee.server"
import {
  getDeciderByTripId,
  updateDeciderByDeciderId,
} from "~/models/decider.server"
import { getTripById } from "~/models/trip.server"
import {
  RoundedRectangle,
  WideButton,
  Avatar,
  TitleText,
  CostDescription,
  DeciderDescription,
  Header,
  SubHeader,
} from "~/styles/styledComponents"
import SvgBackButton from "~/styles/SVGR/SvgBackButton"
import SvgDice from "~/styles/SVGR/SvgDice"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (params: Params<string>) => {
  invariant(params.tripId, `trips required`)
  const decider = await getDeciderByTripId(params.tripId)
  return decider
}
export const loader: LoaderFunction = async ({ params }) => {
  return json<LoaderData>(await getLoaderData(params))
}

type decider =
  | {
      winnerAvatarUrl: string | null
      winner: string | null
    }
  | undefined

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.tripId, `trips required`)
  const { tripId } = params
  const trip = await getTripById(tripId)
  invariant(trip, `must have a trip`)
  const attendees = await getAttendeeNames(params.tripId)
  invariant(attendees, `need attendees`)
  const attendeeArray = attendees.map((attendee) => attendee.user)
  const winner = attendeeArray[Math.floor(Math.random() * attendeeArray.length)]
  invariant(winner, `winner is not defined`)

  // const decider = await updateDeciderByDeciderId(
  //   trip.deciderId,
  //   winner.userName,
  //   winner.avatarUrl,
  // )

  return redirect(`/trips/${tripId}/decider/`)
}

const Decider: FC = () => {
  const data = useLoaderData<LoaderData>()

  const date = data?.updatedAt ? new Date(data?.updatedAt) : new Date(0)
  const day = date?.toLocaleDateString()
  const time = date?.toLocaleTimeString()

  const { tripId } = useParams()

  const defaultAvatar = `public/img/default-avatar.jpg`

  const rectangleStyles = [`flex`, `mx-2`]
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `text-left`, `flex-1`]
  const centered = [`items-center`, `flex-col`]
  const backButtonHeaderRow = [`flex`, `mt-12`, `mb-16`]
  const buttonContents = [`flex`, `items-center`, `justify-center`]

  return (
    <div className={join(`mx-8`)}>
      <div className={join(...backButtonHeaderRow)}>
        <Link to={`/trips/${tripId}`}>
          <div className={join(`ml-2`)}>
            <SvgBackButton />
          </div>
        </Link>
        <SubHeader>Decider</SubHeader>
      </div>
      <div className={join(...centered)}>
        <div className={join(`mb-20`)}>
          <DeciderDescription>
            <p>
              The Decider will select a traveler in this trip at random to choose
              the next activity.
            </p>
          </DeciderDescription>
        </div>
        <TitleText>
          <span className={join(`mb - 10`)}>Previous Result</span>
        </TitleText>
        <RoundedRectangle className={join(...rectangleStyles)}>
          <div className={join(...avatarDivStyles)}>
            <Avatar src={data?.winnerAvatarUrl || defaultAvatar} />
          </div>
          <div className={join(...titleDivStyles)}>
            <TitleText>{data?.winner}</TitleText>
            <CostDescription className={join(`flex`)}>
              <p>{day}</p>
              <p className={join(`ml-2`)}>{time}</p>
            </CostDescription>
          </div>
        </RoundedRectangle>

        <div className={join(`mt-10`)}>
          <Form method="post">
            <WideButton type="submit" className={join(...buttonContents)}>
              <span
                className={join(
                  `drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]`,
                  `mr-4`,
                )}
              >
                <SvgDice />
              </span>
              Select Random
            </WideButton>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Decider
