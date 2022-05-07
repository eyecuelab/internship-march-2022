/* eslint-disable max-len */
import type { FC } from "react"

import type { LoaderFunction } from "remix"
import { Outlet, json, useLoaderData, Link, Form } from "remix"

import { User } from "@prisma/client"
import type { Trip, Attendee } from "@prisma/client"
import invariant from "tiny-invariant"

import { getAttendeesByUserId } from "~/models/attendee.server"
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
  MainBtn,
  ProfileAvatarMain,
  ProfileAvatarImg,
} from "~/styles/styledComponents"
import SvgBackButton from "~/styles/SVGR/SvgBackButton"
import SvgDefaultAvatar from "~/styles/SVGR/SvgDefaultAvatar"
import SvgGear from "~/styles/SVGR/SvgGear"
import SvgTrip from "~/styles/SVGR/SvgPin"
import SvgProfileDial from "~/styles/SVGR/SvgProfileDial"
import { join } from "~/utils"

import NavBar from "../navbar"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request) => {
  const userId = await requireUserId(request)
  const user = await getUserById(userId)
  invariant(user, `user must exist`)

  //--------------
  const tripList: Trip[] = []
  await Promise.all(
    user.attendees.map(async (attendee) => {
      const trip = await getTripById(attendee.tripId)
      if (trip) {
        tripList.push(trip)
      }
    }),
  )

  // const tripList = attendeeTrips.map(async (item: Attendee) => {
  //   return await getTripById(item.tripId)
  // })
  // console.log(tripList)

  //----------------
  return { user: user, trips: tripList }
  // return { user: user }
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(await getLoaderData(request))
}

const Index: FC = () => {
  //-----------
  //NEED:
  //X (data.user)-USER avatar url
  //-USER.trips OR .attendees - list of trip objects (with details) --> GET TRIP BY ID AND RETURN IN LOADER
  //------------

  //Main Data
  const data = useLoaderData<LoaderData>()
  console.log(data)
  console.log(`===========`)
  console.log(data.user)
  console.log(`===========`)
  console.log(data.trips)
  const user = data?.user
  const trips = data?.trips
  console.log(typeof data.user?.avatarUrl)

  //avatar
  const avatar = data.user?.avatarUrl ? (
    data.user?.avatarUrl
  ) : (
    <SvgDefaultAvatar />
  ) // change with default avatar link
  console.log(avatar)

  //Dates
  const convertStringToDate = (inputDate: string) => {
    return (inputDate ? new Date(inputDate) : new Date(0)).toLocaleDateString()
  }
  const createdDate = data.user?.createdAt
  console.log(typeof createdDate)
  const profileCreatedDate = convertStringToDate(createdDate.toString())

  //Attendees
  const attendees = data?.user?.attendees
  // console.log(attendees)
  const attendeesCount = attendees.length

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
                {/* <Link to={`/logout`}>
                  <span className={join(`flex`, `m-8`)}>
                    <span className={join(`ml-2`)}>Logout</span>
                  </span>
                </Link> */}

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
                {/* {typeof avatar === `string` ? (
                  <ProfileAvatarImg src={avatar} />
                ) : (
                  avatar
                )} */}
                <SvgDefaultAvatar />
              </ProfileAvatarMain>
            </div>
            <div>
              <ProHugeNumber>{attendees.length}</ProHugeNumber>
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
            {trips.map((trip: Trip) => (
              <div key={trip.id} className={join(`mt-5`)}>
                <Link to={`/trips/${trip.id}`}>
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
                        {attendeesCount}
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
