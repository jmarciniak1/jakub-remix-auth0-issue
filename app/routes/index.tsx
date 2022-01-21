import { MetaFunction, LoaderFunction, useLoaderData, json, Link } from 'remix';
import { authenticator } from '~/services/auth.server';
import { User } from '~/models/user';

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request);
  return { message: 'this is awesome 😎', user };
};
export default function Index() {
  let data = useLoaderData<{ user: User; message: string }>();
  console.log('Data ' + data.message);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      {!data.user && (
        <form action="/auth/auth0" method="post">
          <button>Login</button>
        </form>
      )}
      {data.user && (
        <>
          <p>{data.user.email}</p>
          <form action="/auth/logout" method="post">
            <button>Logout</button>
          </form>
        </>
      )}
    </div>
  );
}
