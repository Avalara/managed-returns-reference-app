import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import apolloLogger from 'apollo-link-logger';

import { authLink } from './auth';

// const CRR_URL = import.meta.env.VITE_CRR_URL
// console.log('CRR_URL', CRR_URL);

const httpLink = createHttpLink({
  uri: CRR_URL,
});

// console.log('import.meta', JSON.stringify(import.meta));
// console.log('NODE_ENV', NODE_ENV);

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
  uri: CRR_URL,
  link: ApolloLink.from([apolloLogger, authLink, httpLink]),
  cache: new InMemoryCache(),
});
