import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql';
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';

import './index.css';

import Home from './routes/Home';
import HomeContent from './components/HomeContent';
import ReconcileYourReturns from './components/ReconcileYourReturns';
import ReturnDetails from './components/ReturnDetails';
import Funding from './components/Funding';
import GetStarted from './components/GetStarted';
import SetUpReturns from './components/SetUpReturns';

import ErrorPage from './routes/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomeContent />,
        handle: { crumb: () => <Link to="/">Home</Link> },
      },
      {
        path: 'returns',
        children: [
          {
            index: true,
            element: <ReconcileYourReturns />,
            handle: { crumb: () => <Link to="/returns">Returns</Link> },
          },
          {
            path: 'reconcile',
            handle: {
              crumb: () => <Link to="/returns/reconcile">Reconcile</Link>,
            },
            children: [
              {
                index: true,
                element: <ReconcileYourReturns />,
              },
              {
                path: ':country/:region/:year/:month',
                element: <ReturnDetails />,
              },
            ],
          },
          {
            path: 'funding',
            element: <Funding />,
            handle: {
              crumb: () => <Link to="/returns/funding">Funding</Link>,
            },
          },
          {
            path: 'set-up-returns',
            element: <SetUpReturns />,
            handle: {
              crumb: () => (
                <Link to="/returns/set-up-returns">Set up returns</Link>
              ),
            },
          },
          {
            path: 'get-started',
            element: <GetStarted />,
            handle: {
              crumb: () => <Link to="/returns/get-started">Get started</Link>,
            },
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <ApolloProvider client={apolloClient}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ApolloProvider>,
);
