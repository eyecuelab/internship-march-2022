import type { FC } from "react"

import { Link } from "remix"
import type { json } from "remix"

import type { Trip } from "@prisma/client"
import type { Params } from "react-router-dom"
import invariant from "tiny-invariant"

import type { TripWithFormattedStops } from "~/utils"

import {
  TripLiContainer,
  TripLiImage,
  TripLiTitle,
  TripLiFlex,
  TripLiDetail,
  TripLiGroup,
  TripHr,
} from "../styles/styledComponents"

type TripViewProps = {
  trip: TripWithFormattedStops
}

const TripView: FC<TripViewProps> = ({ trip }) => {
  return (
    <div>
      <ul>
        <TripLiContainer key={trip.id}>
          <Link to={trip.id}>
            <TripLiImage src="https://images.unsplash.com/photo-1541570213932-8cd806e3f8f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJvYWQlMjB0cmlwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60" />
            <TripLiTitle>{trip.nickName}</TripLiTitle>
            <TripLiDetail>
              {trip.stops.find((stop) => stop.index == 0)?.apiResult?.name ||
                `TBD`}
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
              <TripLiDetail>
                {trip.endDate ? trip.endDate : `00/00/00`}
              </TripLiDetail>
              <TripLiDetail>{trip.stops.length}</TripLiDetail>
            </TripLiFlex>
          </Link>
        </TripLiContainer>
      </ul>
    </div>
  )
}

export default TripView
