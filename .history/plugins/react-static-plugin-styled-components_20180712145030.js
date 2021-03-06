import React from 'react'
import { ServerStyleSheet } from 'styled-components'

module.exports = {
  // Extract the styles into the page meta
  beforeRenderToHtml: (app, { meta }) => {
    meta.styleComponentsSheet = new ServerStyleSheet()
    return meta.styleComponentsSheet.collectStyles(app)
  },
  Head: ({ meta }) => {
    // Place the styles into the HEad
    const styleTags = meta.styleComponentsSheet.getStyleElement()
    return <React.Fragment>{meta.styledComponentsTags}</React.Fragment>
  },
}
