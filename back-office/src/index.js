import React from "react"
import ReactDOM from "react-dom"

import ApolloClient from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createUploadLink } from "apollo-upload-client"
import { ApolloProvider } from "@apollo/react-hooks"

import "remixicon/fonts/remixicon.css"
import "./style/style.scss"
import "basscss/css/basscss.min.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"

const link = createUploadLink({
  uri: process.env.REACT_APP_API_URL || `http://${window.location.host}:3000`,
  credentials: "include",
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root"))

serviceWorker.unregister()
