/* eslint-disable prettier/prettier */
import type { FC } from "react"

import type { ActionFunction, LoaderFunction } from "remix"
import {
  json,
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from "remix"

import invariant from "tiny-invariant"

import { getUserById, updateUserById } from "~/models/user.server"
import { requireUserId } from "~/session.server"
import {
  MainBtn,
  InputLabel,
  ModalBackdrop,
  Modal,
  AddButtonText,
  InputFieldMid,
} from "~/styles/styledComponents"
import SvgSwipeButton from "~/styles/SVGR/SvgSwipeButton"
import { join } from "~/utils"

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>

const getLoaderData = async (request: Request) => {
  const userId = await requireUserId(request)
  const user = await getUserById(userId)
  return { user: user }
}

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(await getLoaderData(request))
}

type ActionData =
  | {
    userId: string | null
    email: string | null
    userName: string | null
  }
  | undefined



export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const user = await getUserById(userId)
  const existingEmail = user?.email
  const existingUserName = user?.userName
  const formData = await request.formData()
  const formUserId = formData.get(`userId`)

  const formEmail = formData.get(`email`)

  const formUserName = formData.get(`userName`)
  const finalEmail = formEmail === `` ? existingEmail : formEmail
  const finalUserName = formUserName === `` ? existingUserName : formUserName


  invariant(typeof formUserId === `string`, `userId must be a string`)
  invariant(typeof finalEmail === `string`, `email must be a string`)
  invariant(typeof finalUserName === `string`, `username must be a string`)


  await updateUserById(formUserId, finalEmail, finalUserName)

  return redirect(`/profile`)
}

const EditProfile: FC = () => {
  const errors = useActionData()
  const navigate = useNavigate()
  const data = useLoaderData()
  const user = data?.user
  const userId = user.id


  const centered = [`flex`, `items-center`, `justify-center`, `flex-col`]
  return (
    <div>
      <ModalBackdrop
        onClick={() => navigate(`/profile`)}
      />

      <Modal className={join(...centered)}>

        <div
          className={join(`pt-2`)}
          onClick={() => navigate(`/profile`)}
        >
          <SvgSwipeButton />
        </div>


        <AddButtonText className={join(`mr-48`, `p-8`)}>
          Update Profile
        </AddButtonText>




        <Form method="post">
          <input type="hidden" name="userId" value={userId} />
          <div>

            <InputLabel className={join(`mr-56`)}>
              Email Address{` `}
              {errors?.email ? (
                <em className="text-red-600">{errors.email}</em>
              ) : null}
              <p>

                <InputFieldMid type="text" name="email" />
              </p>
            </InputLabel>
          </div>
          <div>
            <InputLabel>
              Username{` `}
              {errors?.userName ? (
                <em className="text-red-600">{errors.userName}</em>
              ) : null}
              <p>

                <InputFieldMid type="text" name="userName" />
              </p>
            </InputLabel>
          </div>


          <p className={join(`mt-8`, `pb-16`)}>
            <MainBtn type="submit">
              Update Profile
            </MainBtn>
          </p>
        </Form>




      </Modal>
    </div>
  )
}

export default EditProfile