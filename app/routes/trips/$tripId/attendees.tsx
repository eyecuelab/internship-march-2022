import type { FC } from "react"

import { Link, json, useLoaderData } from "remix"
import type { LoaderFunction } from "remix"

import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeesByTripId } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { TitleText, Avatar, RoundedRectangle } from "~/styles/styledComponents"
import SvgCoins from "~/styles/SVGR/SvgCoins"
import SvgForwardButton from "~/styles/SVGR/SvgForwardButton"
import SvgLuggage from "~/styles/SVGR/SvgLuggage"
import SvgVerticalLine from "~/styles/SVGR/SvgVerticalLine"
import SvgWhiteDice from "~/styles/SVGR/SvgWhiteDice"
import { formatTrip, join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

export const loader: LoaderFunction = async ({ request, params }) => {
  return json(await getLoaderData(request, params))
}
const getLoaderData = async (request: Request, params: Params<string>) => {
  const { tripId } = params
  invariant(tripId, `must have tripId`)
  const tempTrip = await getTripById(tripId)
  const attendees = await getAttendeesByTripId(tripId)
  invariant(tempTrip, `need tripId`)
  const trip = formatTrip(tempTrip)
  invariant(attendees, `need attendeesId`)
  console.log(trip.stops)
  return { trip, attendees }
}

// tripId, attendees,start and end dates, start and end location, stops[]

const AttendeesLayout: FC = () => {
  const data = useLoaderData<LoaderData>()

  const defaultAvatar = `public/img/default-avatar.jpg`
  const rectangleStyles = [`flex`, `mx-2`, `items-center`]
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `flex-1`]
  const linkStyles = [`flex`, `justify-center`, `w-full`]
  const packingLinkStyles = [`mb-4`]
  const costShareLinkStyles = [`my-4`]
  const deciderLinkStyles = [`mt-4`]
  const linkItemStyles = [`mx-auto`]
  const hrStyles = [
    `border-solid`,
    `border-1`,
    `mx-4`,
    `w-full`,
    `border-white`,
    `opacity-20`,
  ]

  return (
    <div>
      <div>
        <div>
          <RoundedRectangle className={join(...rectangleStyles, `flex-col`)}>
            <div className={join(...linkStyles, `mb-4`)}>
              <div className={join(`mx-auto`)}>
                <TitleText className={join(`mb-3`)}>Starts</TitleText>
                <TitleText fontWeight={400} fontSize={`14px`}>
                  {data.trip.startDate ? data.trip.startDate : `00/00/00`}
                </TitleText>
                <TitleText fontWeight={400} fontSize={`14px`}>
                  {data.trip.stops[0]
                    ? data.trip.stops[0].apiResult.name
                    : `TBD`}
                </TitleText>
              </div>
              <SvgVerticalLine />
              <div className={join(`mx-auto`)}>
                <TitleText className={join(`mb-3`)}>Ends</TitleText>
                <TitleText fontWeight={400} fontSize={`14px`}>
                  {data.trip.endDate ? data.trip.endDate : `00/00/00`}
                </TitleText>
                <TitleText fontWeight={400} fontSize={`14px`}>
                  {data.trip.stops[-1]
                    ? data.trip.stops[-1].apiResult.name
                    : `TBD`}
                </TitleText>
              </div>
            </div>
            <hr className={join(...hrStyles)} />
            <div className={join(`mx-auto`, `w-full`)}>
              <TitleText className={join(`mx-auto`, `mb-3`, `ml-3`, `mr-auto`)}>
                Travelers
              </TitleText>
              <div className={join(`flex`, `flex-wrap`)}>
                {data.attendees.map((attendee, index) => (
                  <div
                    className={join(`flex-row`, `flex`, `items-center`, `w-2/4`)}
                    key={attendee.user.id + attendee.user.id}
                  >
                    <span className={join(...avatarDivStyles)}>
                      <Avatar src={attendee.user.avatarUrl || defaultAvatar} />
                    </span>
                    <span className={join(...titleDivStyles)}>
                      <TitleText fontWeight={500} fontSize={`14px`}>
                        {attendee.user.userName}
                      </TitleText>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </RoundedRectangle>
        </div>
      </div>
      <RoundedRectangle className={join(...rectangleStyles, `flex-col`)}>
        <Link
          to={`/trips/${data.trip.id}/packing-list/`}
          className={join(...linkStyles, ...packingLinkStyles)}
        >
          <div className={join(...linkItemStyles, `ml-0`)}>
            <SvgLuggage />
          </div>

          <TitleText className={join(...linkItemStyles)} fontWeight={400}>
            Packing List
          </TitleText>
          <div className={join(...linkItemStyles, `mr-0`, `pt-1.5`)}>
            <SvgForwardButton />
          </div>
        </Link>
        <hr className={join(...hrStyles)} />
        <Link
          to={`/trips/${data.trip.id}/expenses/`}
          className={join(...linkStyles, ...costShareLinkStyles)}
        >
          <div className={join(...linkItemStyles, `ml-0`)}>
            <SvgCoins />
          </div>

          <TitleText className={join(...linkItemStyles)} fontWeight={400}>
            Cost Sharing
          </TitleText>
          <div className={join(...linkItemStyles, `mr-0`, `pt-1.5`)}>
            <SvgForwardButton />
          </div>
        </Link>
        <hr className={join(...hrStyles)} />
        <Link
          to={`/trips/${data.trip.id}/decider/`}
          className={join(...linkStyles, ...deciderLinkStyles)}
        >
          <div className={join(...linkItemStyles, `ml-0`)}>
            <SvgWhiteDice />
          </div>
          <TitleText className={join(...linkItemStyles)} fontWeight={400}>
            Decider
          </TitleText>
          <div className={join(...linkItemStyles, `mr-0`, `pt-1.5`)}>
            <SvgForwardButton />
          </div>
        </Link>
      </RoundedRectangle>
    </div>
  )
}

export default AttendeesLayout
