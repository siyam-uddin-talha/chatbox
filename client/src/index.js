/*
author: Arnob Islam
date: '01-06-22' 
description: 'This application is a part of facebook-messenger backend, which is deploy in heroku and the client side is delply in netlify'
*/

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./style/app.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom";
import Context from "./components/Provider/Context";

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_URL_GRAPHQL,
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: "include",
});

ReactDOM.render(
  <React.Fragment>
    <Router>
      <ApolloProvider client={client}>
        <Context>
          <App />
        </Context>
      </ApolloProvider>
    </Router>
  </React.Fragment>,
  document.getElementById("root")
);
