import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import apolloLogger from 'apollo-link-logger';

import { authLink } from './auth';
import config from '../../src/config';

const httpLink = createHttpLink({
  uri: config.CRR_URL,
});

if (import.meta.env.VITE_DEV) {
  loadDevMessages();
  loadErrorMessages();
}

export const apolloClient = new ApolloClient({
  uri: config.CRR_URL,
  link: ApolloLink.from([apolloLogger, authLink, httpLink]),
  cache: new InMemoryCache(),
});
