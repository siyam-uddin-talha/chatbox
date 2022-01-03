import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./style/app.css"
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, } from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'
// import { WebSocketLink } from "@apollo/client/link/ws"
import Context from './components/Provider/Context'


// import { getMainDefinition } from '@apollo/client/utilities'

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql', credentials: 'include',


})



const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: 'include',
})





ReactDOM.render(
  <React.Fragment>
    <Router>
      <ApolloProvider client={client} >
        <Context>
          <App />
        </Context>
      </ApolloProvider>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);

