import type { EntryContext } from "remix"
import { RemixServer } from "remix"

import ReactDOMServer, { renderToString } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"

import StylesContext from "./styles-context"

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
): Response {
  const sheet = new ServerStyleSheet()

  // first pass to collect styles
  renderToString(
    sheet.collectStyles(
      <StylesContext.Provider value={null}>
        <RemixServer context={remixContext} url={request.url} />
      </StylesContext.Provider>,
    ),
  )

  // get the styles
  const styles = sheet.getStyleTags()
  sheet.seal()

  // second time with the styles on context
  const markup = ReactDOMServer.renderToString(
    <StylesContext.Provider value={styles}>
      <RemixServer context={remixContext} url={request.url} />
    </StylesContext.Provider>,
  )

  return new Response(`<!DOCTYPE html>` + markup, {
    status: responseStatusCode,
    headers: {
      ...Object.fromEntries(responseHeaders),
      "Content-Type": `text/html`,
    },
  })
}
