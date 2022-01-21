import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { login, User } from '~/models/user';
import { sessionStorage } from '~/services/session.server';

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<User>(sessionStorage);

let { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_DOMAIN, AUTH0_CALLBACK_URL } =
  process.env;

let auth0 = {
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  domain: AUTH0_DOMAIN,
  callbackUrl: AUTH0_CALLBACK_URL,
};

if (!auth0.domain) throw new Error('Missing Auth0 domain.');
if (!auth0.clientId) throw new Error('Missing Auth0 client id.');
if (!auth0.clientSecret) throw new Error('Missing Auth0 client secret.');
if (!auth0.callbackUrl) throw new Error('Missing Auth0 redirect uri.');

authenticator.use(
  new Auth0Strategy(
    {
      clientID: auth0.clientId,
      clientSecret: auth0.clientSecret,
      domain: auth0.domain,
      callbackURL: auth0.callbackUrl,
    },
    async ({ accessToken, refreshToken: string, extraParams, profile }) => {
      return login(profile.emails[0].value);
    }
  ),
  'auth0'
);
