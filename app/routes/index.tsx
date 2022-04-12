import type { FC } from "react"

import { Link, Form } from "remix"

import { join, useOptionalUser } from "~/utils"

const Index: FC = () => {
  const user = useOptionalUser()
  return (
    <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1541570213932-8cd806e3f8f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJvYWQlMjB0cmlwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
                alt="Person looking out the window while on a road trip"
              />
              <div
                className={join(
                  `absolute`,
                  `inset-0`,
                  `bg-[color:rgba(254,204,27,0.5)]`,
                  `mix-blend-multiply`,
                )}
              />
            </div>
            <div
              className={join(
                `lg:pb-18`,
                `relative`,
                `px-4`,
                `pt-16`,
                `pb-8`,
                `sm:px-6`,
                `sm:pt-24`,
                `sm:pb-14`,
                `lg:px-8`,
                `lg:pt-32`,
              )}
            >
              <h1
                className={join(
                  `text-center`,
                  `text-6xl`,
                  `font-extrabold`,
                  `tracking-tight`,
                  `sm:text-8xl`,
                  `lg:text-9xl`,
                )}
              >
                <span className="block uppercase text-yellow-500 drop-shadow-md">
                  GoGoYonder
                </span>
              </h1>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  {user ? (
                    <div>
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
                        View Profile for {user.email}
                      </Link>
                      <Form action="/logout" method="post">
                        <button
                          type="submit"
                          className={join(
                            `rounded`,
                            `bg-slate-600`,
                            `py-2`,
                            `px-4`,
                            `text-blue-100`,
                            `hover:bg-blue-500`,
                            `active:bg-blue-600`,
                          )}
                        >
                          Logout
                        </button>
                      </Form>
                    </div>
                  ) : (
                    <div
                      className={join(
                        `space-y-4`,
                        `sm:mx-auto`,
                        `sm:inline-grid`,
                        `sm:grid-cols-2`,
                        `sm:gap-5`,
                        `sm:space-y-0`,
                      )}
                    >
                      <Link
                        to="/join"
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
                        Sign up
                      </Link>
                      <Link
                        to="/login"
                        className={join(
                          `flex`,
                          `items-center`,
                          `justify-center`,
                          `rounded-md`,
                          `bg-yellow-500`,
                          `px-4`,
                          `py-3`,
                          `font-medium`,
                          `text-white`,
                          `hover:bg-yellow-600`,
                        )}
                      >
                        Log In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default Index
