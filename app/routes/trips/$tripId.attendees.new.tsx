import type { FC, useEffect } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import { Link, json, Form, redirect, useActionData, useParams, useLoaderData } from "remix"

import invariant from "tiny-invariant"

import { useCatch } from "@remix-run/react";

import { Trip, getTrip } from "~/models/trip.server"
import { createAttendee } from "~/models/attendee.server"
import { getUserByEmail } from "~/models/user.server"
import { requireUserId } from "~/session.server"
import { join, validateEmail} from "~/utils"
import {MainBtn, InputField, InputLabel, Header, ErrorDiv} from "../../styles/styledComponents"

type LoaderData = {
  trip: Trip;
};

export const loader: LoaderFunction = async ({
  params,
}) => {
  invariant(params.tripId, `params.id is required`);
  
  const trip = await getTrip(params.tripId);
  invariant(trip, `Trip not found: ${params.tripId}`);
  
  return json<LoaderData>({ trip });
};

interface ActionData {
  errors: {
    tripId?: string 
    email?: string    
    user?: string  
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const tripIdInput = formData.get(`tripId`) 
  const email = formData.get(`email`)!
  const tripId = tripIdInput ? tripIdInput.toString() : null
  const user = await getUserByEmail(email.toString())
  const userId = user
 
  if(!validateEmail(email)) {
    return json<ActionData>(
      { errors: {email: `Please enter a valid email address`}},
      { status: 400}
    )
  }
  if(!user){
    return json<ActionData>(
      { errors: {user: `Please enter an existing user`}},
      { status: 400}
    )
  }
  if(!tripId){
    return json<ActionData>(
      { errors: {tripId: `This trip is no longer valid`}},
      { status: 400}
    )
  }

  invariant(typeof userId === `string`, `userId must be a string`)

  await createAttendee({ tripId, userId })
  return redirect(`/trips`)
}

const NewAttendee: FC = () => {
  const data = useLoaderData() as LoaderData;
  const actionData = useActionData();
  return (
    <div>
      <Header>
        Add New Attendee
      </Header>

      <Form method="post">
        <div className={join(`text-center`,`my-5`)}>
          <input type="hidden"
            name="tripId"
            value={data.trip.id}
          />
          <InputLabel>
            User Email:  
            <InputField type="text" name="email"
            className={join(`mx-auto`,`block`)}/>
          </InputLabel>
          <br/>
            {actionData?.errors?.tripId ? (
              <ErrorDiv>
                <em>{actionData.errors.tripId}</em>
              </ErrorDiv>
              ) : actionData?.errors?.user ? (
                <ErrorDiv>
                <em>{actionData.errors.user}</em>
                </ErrorDiv>
                ) : actionData?.errors?.email ? (
                  <ErrorDiv>
                  <em>{actionData.errors.email}</em>
                  </ErrorDiv>
                  ) : null
          }
          <MainBtn
            type="submit"
            >
            Add Attendee
          </MainBtn>
        </div>
      </Form>

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
        to="/trips"
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
        Return to trips
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
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <ErrorDiv>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </ErrorDiv>
  );
}

export default NewAttendee