import type { FC } from "react"

import { Form } from "remix"

import { join } from "~/utils"

type ResultType = {
  result: Record<string, number | string>
  tripId: string | undefined
}
const StopResult: FC<ResultType> = ({ result, tripId }) => {
  return (
    <Form method="post">
      <div className={join(`px-8`, `py-4`, `flex`, `items-center`)}>
        <div>
          <h1 className={join(`text-lg`, `mb-1`)}>{result.name}</h1>
          <h1 className="text-base">{result.formatted_address}</h1>
          <input hidden readOnly name="result" value={JSON.stringify(result)} />
          <input hidden readOnly name="tripId" value={tripId} />
          <button type="submit">Add Stop</button>
        </div>
        <div className={join(`bg-[#84A98C]`, `p-1.5`, `ml-auto`, `mr-3`)}>
          <h1>⭐: {result.rating}</h1>
        </div>
      </div>
    </Form>
  )
}
export default StopResult
