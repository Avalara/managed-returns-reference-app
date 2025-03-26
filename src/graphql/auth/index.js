import { jwtDecode } from 'jwt-decode';
import { ApolloLink, Observable } from '@apollo/client';
import axios from 'axios';

import config from '../../config';
class AuthService {
  async login() {
    let response;
    const creds = `${localStorage.getItem('clientId')}:${localStorage.getItem(
      'clientSecret'
    )}`;

    const encodedCredentials = btoa(creds);

    try {
      response = await axios({
        method: 'post',
        url: config.TOKEN_URL,
        data: {
          grant_type: 'client_credentials',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedCredentials}`,
        },
      });
    } catch (fetchErr) {
      console.log(fetchErr);
      throw fetchErr;
    }

    if (response.status !== 200) {
      throw new Error('Login failed');
    }

    const access_token = await response?.data?.access_token;
    this.setToken(access_token);
    return access_token;
  }

  setToken(access_token) {
    localStorage.setItem('access_token', access_token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  }
}

export const authService = new AuthService();

export const authLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then(async (operation) => {
          if (authService.isTokenExpired()) {
            console.log('Token is expired, trying to refresh it...');
            // Token is expired, try to refresh it
            try {
              await authService.login();
              console.log('Successfully logged in');
            } catch (error) {
              // Handle refresh error (e.g., redirect to login page)
              console.log('Error logging in', error);
              authService.logout();
              // window.location.href = '/login';
              return;
            }
          }
          const token = authService.getToken();
          if (token) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${token}`,
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);
