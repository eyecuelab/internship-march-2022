import type { FC } from "react"

import { Link, Form } from "remix"

import type { Trip } from "@prisma/client"
import type { Params } from "react-router-dom"
import invariant from "tiny-invariant"

import { join } from "~/utils"
import type { TripWithFormattedStops } from "~/utils"

import {
  TripLiContainer,
  TripLiImage,
  TripLiTitle,
  TripLiFlex,
  TripLiDetail,
  TripLiGroup,
  TripHr,
  TripBtn,
  DangerBtn,
} from "../styles/styledComponents"

type TripViewProps = {
  trip: TripWithFormattedStops
  isAccepted?: boolean
}
const LinkComponents: FC<TripViewProps> = ({ trip }) => {
  return (
    <>
      <TripLiImage src="https://images.unsplash.com/photo-1541570213932-8cd806e3f8f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJvYWQlMjB0cmlwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60" />
      <TripLiTitle>{trip.nickName}</TripLiTitle>
      <TripLiDetail>
        {trip.stops.find((stop) => stop.index == 0)?.apiResult?.name || `TBD`}
        <span className="mx-5">→</span>
        {trip.stops.find((stop) => stop.index == trip.stops.length - 1)
          ?.apiResult?.name || `TBD`}
      </TripLiDetail>
      <TripHr />
      <TripLiFlex>
        <TripLiGroup>Starts</TripLiGroup>
        <TripLiGroup>Ends</TripLiGroup>
        <TripLiGroup>Stops</TripLiGroup>
        <TripLiDetail>
          {trip.startDate ? trip.startDate : `00/00/00`}
        </TripLiDetail>
        <TripLiDetail>{trip.endDate ? trip.endDate : `00/00/00`}</TripLiDetail>
        <TripLiDetail>{trip.stops.length}</TripLiDetail>
      </TripLiFlex>
    </>
  )
}
const TripView: FC<TripViewProps> = ({ trip, isAccepted }) => {
  return (
    <div>
      <ul>
        <TripLiContainer key={trip.id}>
          {isAccepted ? (
            <Link to={trip.id}>
              <LinkComponents trip={trip} />
            </Link>
          ) : (
            <>
              <LinkComponents trip={trip} />
              <Form method="post">
                <input type="hidden" name="tripId" value={trip.id} />
                <TripBtn type="submit">Accept Trip Invite</TripBtn>
              </Form>
              <Form method="post">
                <input type="hidden" name="tripId" value={trip.id} />
                <input type="hidden" name="decline" value="decline" />
                <DangerBtn
                  type="submit"
                  className={join(`bg-[#2F3E46]`, `text-[#FF5E03]`)}
                >
                  Decline Trip Invite
                </DangerBtn>
              </Form>
            </>
          )}
        </TripLiContainer>
      </ul>
    </div>
  )
}

export default TripView
