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
  ProfileFormInputFrame,
  ProfileFormPlaceholder,
  ProfileFormInputText,
  ProfileFormCancelBtn,
  ProfileFormSubmitBtn,
  ProRoundedRectangle,
  ProfileAvatarEdit,
  ProfileAvatarImg,
  ProfileAvatarImgEdit,
  ProAvatarInput,
} from "~/styles/styledComponents"
import SvgBackButton from "~/styles/SVGR/SvgBackButton"
import SvgDefaultAvatar from "~/styles/SVGR/SvgDefaultAvatar"
import SvgPencil from "~/styles/SVGR/SvgPencil"
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
  // const errors: ActionData = {
  //   userId: formUserId ? null : `userId is required`,
  //   email: formEmail ? null : `email is required`,
  //   userName: formUserName ? null : `username is required`,
  // }
  // const hasErrors = Object.values(errors).some(
  //   (errorMessage) => errorMessage
  // )
  // if (hasErrors) {
  //   return json<ActionData>(errors)
  // }


  await updateUserById(formUserId, finalEmail, finalUserName)

  return redirect(`/profile`)
}

const Edit: FC = () => {
  const errors = useActionData()
  const navigate = useNavigate()
  const data = useLoaderData()
  const user = data?.user
  const userId = user.id
  const avatar = user?.avatarUrl ? (
    user?.avatarUrl
  ) : (
    <SvgDefaultAvatar />)
  // console.log(avatar)
  // const state: "idle" | "success" | "error" = actionData?.


  const centered = [`flex`, `items-center`, `place-content-center`, `flex-col`]
  return (
    <div className={join(...centered)}>

      <div className={join(`grid`, `grid-cols-3`, `justify-center`, `align-middle`, `w-full`, `pb-20`, `mt-2`, `content-center`)}>
        <button
          className={join(`pt-2`, `flex`, `justify-end`, `hover:pointer-events-auto`)}
          onClick={() => navigate(`/profile`)}
        >
          <SvgBackButton />
        </button>
        <div className={join(`px-50`, `flex`, `justify-center`, `text-xs`, `items-center`, `text-[#E4EDDF]`)}>
          Settings
        </div>
      </div>



      <Form method="post">
        <input type="hidden" name="userId" value={userId} />
        <div>

          <div className={join(`flex`, `justify-center`, `flex-col`, `align-middle`, `ml-4`)}>
            <ProRoundedRectangle className={join(`items-center`, `grid grid-cols-4`, `justify-between`)}>

              <ProfileAvatarEdit
                className={join(`flex`, `items-center`, `place-content-center`, `col-start-1`, `col-span-1`, `w-fit`)}
              >
                {typeof avatar === `string` ? (
                  <ProfileAvatarImgEdit src={avatar} />
                ) : (
                  avatar
                )}
                {/* <SvgDefaultAvatar /> */}
              </ProfileAvatarEdit>

              <div className={join(`flex-col`, `col-start-2`, `col-span-2`, `w-3/5`, `pl-2`, `pr-2`, `mr-3`)}>
                <div className={join(`mt-30`)}>
                  <ProfileFormPlaceholder>Photo URL</ProfileFormPlaceholder>
                </div>

                <div className={join(`mt-30`)}>
                  <p className={join(`text-white/100`, `text-xs`)}>{avatar.slice(0, 28)}</p>
                </div>

                <div className={join(`-mt-1`, `flex`)}>
                  <ProAvatarInput type="email" name="email" className={join(`mt-2`, `pr-2`)} />
                </div>
              </div>

              <SvgPencil className={join(`col-start-4`, `col-span-1`, `w-fit`, `mr-2`)} />

            </ProRoundedRectangle>
            <ProfileFormInputFrame>

              <div className={join(`mt-30`)}>

                <ProfileFormPlaceholder>Email</ProfileFormPlaceholder>
              </div>

              <div className={join(`-mt-1`)}>

                <ProfileFormInputText type="email" name="email" className={join(`items-center`)} />
              </div>
            </ProfileFormInputFrame>

            {errors?.email ? (
              <em className="text-red-600">{errors.email}</em>
            ) : null}
            <ProfileFormInputFrame>

              <div className={join(`mt-30`)}>

                <ProfileFormPlaceholder>Username</ProfileFormPlaceholder>
              </div>

              <div className={join(`-mt-1`)}>

                <ProfileFormInputText type="userName" name="userName" className={join(`items-center`)} />
              </div>

            </ProfileFormInputFrame>
            {errors?.userName ? (
              <em className="text-red-600">{errors.userName}</em>
            ) : null}



          </div>


        </div>


        <div className={join(`flex`, `flex-row`, `w-276`, `absolute`, `left-0`, `bottom-3`, `h-16`, `w-full`, `place-content-center`)}>

          <ProfileFormCancelBtn className={join(`flex`, `items-center`, `text-xs`, `place-content-center`)}
            onClick={() => navigate(`/profile`)}>
            Cancel
          </ProfileFormCancelBtn>


          <ProfileFormSubmitBtn className={join(`flex`, `items-center`, `text-xs`, `place-content-center`)} type="submit">
            Update Profile
          </ProfileFormSubmitBtn>
        </div>
      </Form >




    </div >
  )
}

export default Edit