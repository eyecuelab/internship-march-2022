import type { FC } from "react"

import { Link, Outlet, NavLink, json, useLoaderData } from "remix"
import type { LoaderFunction } from "remix"

import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeesByTripId } from "~/models/attendee.server"
import { getTripById } from "~/models/trip.server"
import { TitleText, Avatar, RoundedRectangle } from "~/styles/styledComponents"
import SvgCoins from "~/styles/SVGR/SvgCoins"
import SvgDice from "~/styles/SVGR/SvgDice"
import SvgSvgHorizontalLine from "~/styles/SVGR/SvgHorizontalLine"
import SvgLuggage from "~/styles/SVGR/SvgLuggage"
import SvgVerticalLine from "~/styles/SVGR/SvgVerticalLine"
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
  return { trip, attendees }
  console.log(tripId)
}

// tripId, attendees,start and end dates, start and end location, stops[]

const AttendeesLayout: FC = () => {
  const data = useLoaderData<LoaderData>()

  console.log(data)

  const defaultAvatar = `public/img/default-avatar.jpg`
  const rectangleStyles = [`flex`, `mx-2`]
  const avatarDivStyles = [`ml-2`, `flex`]
  const titleDivStyles = [`ml-4`, `flex-1`]

  return (
    <div>
      <div>
        <div>
          <RoundedRectangle className={join(...rectangleStyles, `flex-col`)}>
            <div className={join(`flex`, `content-start`)}>
              <div className={join(`pr-10`, `ml-8`, `mb-3`)}>
                <TitleText className={join(`mb-3`)}>Starts</TitleText>
                <TitleText>
                  {data.trip.startDate ? data.trip.startDate : `00/00/00`}
                </TitleText>
                <TitleText>
                  {data.trip.stops[0]
                    ? data.trip.stops[-1].apiResult.name
                    : `TBD`}
                </TitleText>
              </div>
              <SvgVerticalLine />

              <div className={join(`pl-10`, `ml-6`)}>
                <TitleText className={join(`mb-3`)}>Ends</TitleText>
                <TitleText>
                  {data.trip.endDate ? data.trip.endDate : `00/00/00`}
                </TitleText>
                <TitleText>
                  {data.trip.stops[-1]
                    ? data.trip.stops[-1].apiResult.name
                    : `TBD`}
                </TitleText>
              </div>
            </div>
            <SvgSvgHorizontalLine />
            <div className={join(`mt-3`, `flex-col`, `mt-2px`)}>
              <TitleText>
                <div className={join(`ml-8`, `mb-3`)}>Travelers</div>
              </TitleText>
              <div>
                <ul className={join(`mx-6`)}>
                  {data.attendees.map((attendee) => (
                    <li
                      className={join(`flex-row`, `flex`, `items-center`)}
                      key={attendee.user.id + attendee.user.id}
                    >
                      <span className={join(...avatarDivStyles)}>
                        <Avatar src={attendee.user.avatarUrl || defaultAvatar} />
                      </span>
                      <span className={join(...titleDivStyles)}>
                        <TitleText>{attendee.user.userName}</TitleText>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RoundedRectangle>
        </div>
      </div>
      <RoundedRectangle className={join(...rectangleStyles, `flex-col`)}>
        <Link to="packing-list/" className={join()}>
          <SvgLuggage />
          Packing List
        </Link>
        <Link to="expenses/" className={join()}>
          <SvgCoins />
          Expenses
        </Link>
        <Link to="decider/" className={join()}>
          <SvgDice />
          Decider
        </Link>
      </RoundedRectangle>
    </div>
  )
}

export default AttendeesLayout
