import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import apolloLogger from 'apollo-link-logger';

import { authLink } from './auth';
import config from '../config';

const GRAPHQL_URL = config.GRAPHQL_URL;

console.log('GRAPHQL_URL', GRAPHQL_URL);

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
});

// TODO: auth will be jwt later
// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = localStorage.getItem('token');
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

if (import.meta.env.VITE_DEV) {
  loadDevMessages();
  loadErrorMessages();
}

export const apolloClient = new ApolloClient({
  uri: GRAPHQL_URL,
  link: ApolloLink.from([apolloLogger, authLink, httpLink]),
  cache: new InMemoryCache(),
});
