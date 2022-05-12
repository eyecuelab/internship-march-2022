import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Outlet, json, useLoaderData, Link, Form } from "remix"

import type { Trip } from "@prisma/client"
import invariant from "tiny-invariant"

import { getTripById } from "~/models/trip.server"
import { getUserById } from "~/models/user.server"
import { requireUserId } from "~/session.server"
import {
  AddButtonText,
  Header,
  SubHeader,
  ProHugeNumber,
  ProH4,
  ProBody,
  ProTripImage,
  ProfileAvatarMain,
  ProfileAvatarImg,
} from "~/styles/styledComponents"
import SvgDefaultAvatar from "~/styles/SVGR/SvgDefaultAvatar"
import SvgGear from "~/styles/SVGR/SvgGear"
import SvgTrip from "~/styles/SVGR/SvgPin"
import SvgProfileDial from "~/styles/SVGR/SvgProfileDial"
import type { FullTrip } from "~/utils"
import { join } from "~/utils"

import NavBar from "../navbar"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request) => {
  const userId = await requireUserId(request)
  const user = await getUserById(userId)
  invariant(user, `user must exist`)

  const tripList: FullTrip[] = []
  const today = new Date().getUTCMilliseconds()

  await Promise.all(
    user.attendees.map(async (attendee) => {
      const trip = await getTripById(attendee.tripId)
      if (trip?.endDate) {
        if (trip.endDate.getUTCMilliseconds() < today) {
          tripList.push(trip)
        }
      }
    }),
  )

  return { user: user, trips: tripList }
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(await getLoaderData(request))
}

const Index: FC = () => {
  const data = useLoaderData<LoaderData>()

  const user = data?.user
  const trips = data?.trips

  const avatar = data.user?.avatarUrl ? (
    data.user?.avatarUrl
  ) : (
    <SvgDefaultAvatar />
  )
  const convertStringToDate = (inputDate: string) => {
    return (inputDate ? new Date(inputDate) : new Date(0)).toLocaleDateString()
  }
  const createdDate = data.user?.createdAt
  const profileCreatedDate = convertStringToDate(createdDate.toString())

  return (
    <>
      <div className="flex-col">
        <div className={join(`flex`, `justify-between`, `items-center`)}>
          <div>
            <Header>Your Account</Header>
          </div>
          <div className="mx-8">
            <Outlet />
            <div className={join(`flex`, `justify-between`, `items-center`)}>
              <AddButtonText>
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className={join(`rounded`, `py-2`, `px-4`, `text-#CAD2C5`)}
                  >
                    Logout
                  </button>
                </Form>
              </AddButtonText>
              <Link to={`edit`}>
                <span className={join(`flex`, `m-8`)}>
                  <SvgGear />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className={join(`container`, `mx-auto`, `-space-y-60`)}>
          <div className={join(`flex`, `justify-center`, `mb-10`)}>
            <SvgProfileDial />
          </div>
          <div
            className={join(`flex-col`, `text-center`, `justify-content-center`)}
          >
            <div className={join(`flex`, `justify-center`, `pt-6`)}>
              <ProfileAvatarMain
                className={join(`flex`, `items-center`, `place-content-center`)}
              >
                {typeof avatar === `string` ? (
                  <ProfileAvatarImg src={avatar} />
                ) : (
                  avatar
                )}
              </ProfileAvatarMain>
            </div>
            <div>
              <ProHugeNumber>{trips.length}</ProHugeNumber>
              <ProH4>Total Trips</ProH4>
              <ProBody>
                Member Since{` `}
                {profileCreatedDate}
              </ProBody>
            </div>
          </div>
        </div>

        <div className={join(`container`, `mx-auto`, `mt-8`, `pb-50`)}>
          <div className={join(`text-center`, `-ml-20`, `-mb-8`, `p-8`)}>
            <SubHeader>Recent Trips</SubHeader>
          </div>

          <ul>
            {trips.map((trip: FullTrip) => (
              <div key={trip.id} className={join(`mt-5`)}>
                <Link to={`/trips/${trip.id}/attendees/`}>
                  <div
                    className={join(`flex`, `items-center`, `justify-center`)}
                  >
                    <div className={join(`order-1`)}>
                      <ProTripImage>
                        <SvgTrip />
                      </ProTripImage>
                    </div>
                    <div className={join(`order-2`, `ml-5`)}>
                      <ProH4>{trip.nickName}</ProH4>
                      <ProBody>
                        {trip.startDate
                          ? convertStringToDate(trip.startDate.toString())
                          : `tbd`}
                        {` - `}
                        {trip.endDate
                          ? convertStringToDate(trip.endDate.toString())
                          : `tbd`}
                      </ProBody>
                      <ProBody>
                        {trip.attendees.length}
                        {` `}Travelers
                      </ProBody>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </ul>
        </div>
        <div className={join(`h-32`, `w-1`)}>{` `}</div>

        <NavBar />
      </div>
    </>
  )
}

export default Index
