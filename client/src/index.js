import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./style/app.css"
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, } from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'
import Context from './components/Provider/Context'


const httpLink = new HttpLink({
  uri: '/', credentials: 'include',


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

