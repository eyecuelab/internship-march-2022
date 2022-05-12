/* eslint-disable prettier/prettier */
import type { FocusEvent, FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import {
  Link,
  json,
  Form,
  redirect,
  useActionData,
  useParams,
  useLoaderData,
  useNavigate,
} from "remix"

import type { Item, Attendee, User, Trip } from "@prisma/client"
import type { Params } from "react-router"
import invariant from "tiny-invariant"

import { getAttendeeById } from "~/models/attendee.server"
import { createItem } from "~/models/item.server"
import { requireUserId } from "~/session.server"
import {
  MainBtn,
  InputField,
  InputLabel,
  ErrorDiv,
  Header,
  SubHeader,
  ModalBackdrop,
  Modal,
  AddButtonText,
  InputFieldMid,
} from "~/styles/styledComponents"
import SvgSwipeButton from "~/styles/SVGR/SvgSwipeButton"
import { join, MAX_FORM_LENGTH } from "~/utils"

const inputClassName = `join(
  flex
  items-center
  justify-center
  rounded-md
  border
  border-transparent
  bg-white
  px-4
  py-3
  text-base
  font-medium
  text-yellow-700
  shadow-sm
  hover:bg-yellow-50
  sm:px-8
)`

type ActionData =
  | {
    description: string | null
    userId: string | null
    tripId: string | null
  }
  | undefined

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request, params: Params<string>) => {
  // eslint-disable-next-line prefer-destructuring
  const userId = await requireUserId(request)
  // eslint-disable-next-line prefer-destructuring
  const tripId = params.tripId
  invariant(userId, `need userId`)
  invariant(tripId, `need tripId`)
  return await json(getAttendeeById(tripId, userId))
}

export const loader: LoaderFunction = async ({ request, params }) => {
  return json(await getLoaderData(request, params))
}

export const action: ActionFunction = async ({ request, params }) => {
  // eslint-disable-next-line prefer-destructuring
  const userId = await requireUserId(request)
  // eslint-disable-next-line prefer-destructuring
  const tripId = params.tripId
  const formData = await request.formData()
  const description = formData.get(`description`)

  const errors: ActionData = {
    description: description ? null : `Item description is required.`,
    tripId: description ? null : `tripId is required.`,
    userId: description ? null : `userId is required.`,
  }

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage)
  if (hasErrors) {
    return json<ActionData>(errors)
  }

  invariant(typeof description === `string`, `description must be a string`)
  // invariant(typeof userId === `string`, `userId must be a string`)
  invariant(typeof tripId === `string`, `tripId must be a string`)

  await createItem({ description, tripId, userId })

  return redirect(`/trips/${tripId}/packing-list/`)
}

const AddItem: FC = () => {
  const errors = useActionData()
  const params = useParams()
  const navigate = useNavigate()
  const centered = [`flex`, `items-center`, `justify-center`, `flex-col`]
  return (
    <div>
      <ModalBackdrop
        onClick={() => navigate(`/trips/${params.tripId}/packing-list`)}
      />

      <Modal className={join(...centered)}>

        <div
          className={join(`pt-2`)}
          onClick={() => navigate(`/trips/${params.tripId}/packing-list`)}
        >
          <SvgSwipeButton />
        </div>


        <AddButtonText className={join(`mr-48`, `p-8`)}>
          Add Item
        </AddButtonText>




        <Form method="post">
          <p>
            <InputLabel>
              Item Description:{` `}
              {errors?.description ? (
                <em className="text-red-600">{errors.description}</em>
              ) : null}
              <InputFieldMid maxLength={MAX_FORM_LENGTH} 
              type="text" name="description" className={inputClassName} />
            </InputLabel>
          </p>
          <p className={join(`mt-8`, `pb-16`)}>
            <MainBtn type="submit">
              Add Item
            </MainBtn>
          </p>
        </Form>




      </Modal>
    </div>
  )
}

export default AddItem