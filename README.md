# spotify-api-client

This API client for Spotify aims to be flexible enough to be either as minimal or full-fledged as you need.

Each endpoint can be called with a simple function, and you're not tied into any http library under the hood. Consumers of the library can use the default `Fetch`-based http client (or 'fetcher') and polyfill as needed. Alternatively, you create your own based on based on your library of choice.

Middleware gives you the possibility to perform some actions before each request is made to the Spotify API, such as logging. This is also the primary way that authentication is added to each request. Create an auth middleware via the supplied helpers and pass this to `createClient`, and the necessary headers will be added automatically to each request.

Having 'fetchers' passed in from the outside allows for a whole lot of flexibility. Alongside not being tied to any particular library, it makes it easy to add custom timeout logic, request retries. And, if you don't want to go via middleware, you can always do authentication in a custom fetcher and modifier headers yourself.

## Contents

- [Creating a client](#creating-a-client)
- [Adding middleware](#adding-middleware)
  - [Chaining middleware](#chaining-middleware)
  - [Auth middleware](#auth-middleware)
- [Authenticating](#authenticating)
  - [Authorization code flow](#authorization-code-flow)
  - [Authorization code flow with PKCE](#authorization-code-flow-with-pkce)
  - [Implicit grant flow](#implicit-grant-flow)
- [Creating a custom fetcher](#creating-a-custom-fetcher)
- [Error handling](#error-handling)
- [Examples](#examples)
- [API Reference](#api-reference)

## Creating a client

Create a client using the `createClient` function. This should subsequently be passed to all endpoint functions in order to execute requests to the Spotify API.

The `client` is nothing special. It's just a function that takes a `RequestConfig` object as an argument and passes that through the middleware chain and returns the response.

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';

const client = createClient(fetcher);
```

This above example doesn't do very much yet - it'll make a network request, but that's about it. We can add some middleware in order to start making authenticated requests to Spotify.

## Adding middleware

Middleware lets you perform actions just before and just after each request to the Spotify API. This is a useful place to do things like logging, error reporting, applying timeouts, etc. It's also the out-of-the-box way to add authentication to your requests. [Read more about auth middleware](#auth-middleware)

If you know Redux middleware, then this will look very familiar to you.

```js
function loggerMiddleware(next: MiddlewareFetcher) {
  return (request: RequestConfig) => {
    console.log(`Making request to Spotify: ${JSON.stringify(request)}`);
    return next(request);
  };
}

const client = createClient(fetcher, loggerMiddleware);
```

A middleware function takes the `next` middleware as its argument and returns a function that takes a `request`. This function must then return the result of calling `next(request)`. The function returned from your middleware can also be asynchronous.

### Chaining middleware

`composeMiddleware` takes any number of middleware functions and composes them together using `reduceRight` under the hood.

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import {
  createAuthMiddleware,
  composeMiddleware
} from 'spotify-api-client/middleware';

const authMiddleware = createAuthMiddleware({
  token: () => getTokenFromSomewhere(),
  client_id: '<CLIENT_ID>',
  client_secret: '<CLIENT_SECRET>'
});

function addLogging(next: MiddlewareFetcher) {
  return (request: RequestConfig) => {
    console.log(`Making request to Spotify: ${JSON.stringify(request)}`);
    return next(request);
  };
}

function addCrashReporting(next: MiddlewareFetcher) {
  return (request: RequestConfig) => {
    try {
      return next(request);
    } catch (error) {
      console.log(`Error! ${error.message}`);
      Sentry.captureException(error, {
        extra: {
          url: request.url
        }
      });
      throw error;
    }
  };
}

// Middleware functions are composed right-to-left
const middleware = composeMiddleware(
  authMiddleware,
  loggerMiddleware,
  crashMiddleware
);

const client = createClient(fetcher, middleware);
```

### Auth middleware

Middleware is the default way of adding authentication to your requests, and the library comes with a few helpers to do this: [`createAuthMiddleware`](#createAuthMiddleware), [`createBasicAuthMiddleware`](#createBasicAuthMiddleware) and [`createBearerAuthMiddleware`](#createBearerAuthMiddleware).

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import {
  createAuthMiddleware,
  createBasicAuthMiddleware,
  createBearerAuthMiddleware
} from 'spotify-api-client/middleware';

const addAuth = createAuthMiddleware({
  token: 'TOKEN',
  client_id: '<CLIENT_ID>',
  client_secret: '<CLIENT_SECRET>'
});
// This client will add the correct headers for any request.
const client = createClient(fetcher, addAuth);

const addBasicAuth = createBasicAuthMiddleware({
  token: 'TOKEN',
  client_id: '<CLIENT_ID>',
  client_secret: '<CLIENT_SECRET>'
});
// This client will be able to handle any endpoint that requires
// `Basic` auth headers, e.g. authentication endpoints.
const basicClient = createClient(fetcher, addBasicAuth);

const addBearerAuth = createBearerAuthMiddleware({
  token: 'TOKEN'
});
// This client will be able to handle any endpoint that requires
// `Bearer` auth headers, e.g. everything that's not authentication.
const addBearerAuth = createClient(fetcher, addBearerAuth);
```

## Authenticating

Read the Spotify docs on authentication flows.

❗️❗️ **Important:** Never expose your client secret on the frontend! Check which flow is most applicable for your needs.

### Authorization code flow

1. Direct the user to Spotify to authorize your application.

```js
import { createAuthorizationCodeUrl } from 'spotify-api-client/auth';
import { app } from './app';

// Imagine app is some Express application you have running.
app.get('/login', (_, res) => {
  const authUrl = createAuthorizationCodeUrl({
    client_id: '<CLIENT_ID>',
    redirect_uri: '<REDIRECT_URI>',
    state: '<STATE>',
    scope: ['user-read-playback-state', 'user-modify-playback-state']
  });

  return res.redirect(authURL);
});
```

2. Grab the authorization code from the URL when the user is redirected back to your `redirect_uri` and request refresh and access tokens.

```js
import { app } from './app';
import { createClient } from 'spotify-api-client';
import { createBasicAuthMiddleware } from 'spotify-api-client/middleware';
import { fetcher } from 'spotify-api-client/fetcher';
import { authorizationCode } from 'spotify-api-client/auth';

const addBasicAuth = createBasicAuthMiddleware({
  client_id: '<CLIENT_ID>',
  client_secret: '<CLIENT_SECRET>'
});

const client = createClient(fetcher, addBasicAuth);

// Imagine app is some Express application you have running.
app.get('/callback', (req, res, next) => {
  const { code, error, state } = req.query;

  // You should do something here if there was an error
  // or the states don't match!

  try {
    const { body } = await authorizationCode(client, {
      code,
      redirect_uri: '<REDIRECT_URI>'
    });

    const { access_token, expires_in, refresh_token } = body;

    // Do something with the tokens here...

    return res.send('Authenticated!');
  } catch (error) {
    next(error);
  }
});
```

3. Add authentication to your requests to the Spotify API

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { play } from 'spotify-api-client/player';

const addBearerAuth = createBearerAuthMiddleware({
  token: '<TOKEN>'
});

const client = createClient(fetcher, addBearerAuth);

async function playSpotify() {
  await play(client);
}

playSpotify();
```

### Authorization code flow with PKCE

Read the [Spotify docs for this flow](<(https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow-with-proof-key-for-code-exchange-pkce)>)

**🗒 Note:** The Spotify docs contain more info on generating a code verifier and code challenge. It's worth checking this out!

1. Direct the user to Spotify to authorize your application.

```js
import { createAuthorizationCodeWithPkceUrl } from 'spotify-api-client/auth';
import { app } from './app';

// Imagine app is some Express application you have running.
app.get('/login', (_, res) => {
  const authUrl = createAuthorizationCodeWithPkceUrl({
    client_id: '<CLIENT_ID>',
    redirect_uri: '<REDIRECT_URI>',
    state: '<STATE',
    scope: ['user-read-playback-state', 'user-modify-playback-state'],
    code_challenge: '<CODE_CHALLENGE>'
  });

  return res.redirect(authUrl);
});
```

2. Grab the authorization code from the URL when the user is redirected back to your `redirect_uri` and request refresh and access tokens.

```js
import { app } from './app';
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { authorizationCodeFlow } from 'spotify-api-client/auth';

// Note: No auth middleware is technically required for
// the PKCE flow, but a new client would need to be created
// once you've retrieved the tokens.
const client = createClient(fetcher);

// Imagine app is some Express application you have running.
app.get('/callback', async (req, res, next) => {
  const { code, error, state } = req.query;

  // You should do something here if there was an error
  // or the states don't match!

  try {
    const { body } = await authorizationCodeWithPkce(client, {
      code,
      client_id: '<CLIENT_ID>',
      redirect_uri: '<REDIRECT_URI>',
      code_verifier: '<CODE_VERIFIER>'
    });

    const { access_token, expires_in, refresh_token } = body;

    saveTokensSomewhere({ access_token, expires_in, refresh_token });

    return res.send('Authenticated!');
  } catch (error) {
    next(error);
  }
});
```

3. Add authentication to your requests to the Spotify API

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { play } from 'spotify-api-client/player';

const addAuth = createBearerAuthMiddleware({
  token: '<TOKEN>'
});

const client = createClient(fetcher, addAuth);

async () => {
  await play(client);
};
```

### Implicit grant flow

Read the [Spotify docs for this flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow).

1. Direct the user to Spotify to authorize your application.

```js
import { createImplicitGrantUrl } from 'spotify-api-client/auth';

function login() {
  const authUrl = createImplicitGrantUrl({
    client_id: '<CLIENT_ID>',
    redirect_uri: 'REDIRECT_URI',
    state: 'STATE',
    scope: ['user-read-playback-state', 'user-modify-playback-state']
  });
  window.location.href = authURL;
}

login();
```

2. Grab the access token from the hash fragment of the URL (encoded as query string) when the user is redirected back to your `redirect_uri`.

```js
function getAccessTokenFromURL() {
  const url = new URL(window.location);
  const error = url.searchParams.get('error');

  if (error) {
    throw new Error(`Authentication error: ${error}`);
  }

  // Strip the '#' from the start of the hash fragment
  const params = new URLSearchParams(window.location.hash.substring(1));

  const access_token = params.get('access_token');
  const token_type = params.get('token_type');
  const expires_in = params.get('expires_in');
  const state = params.get('state');

  // Be sure to compare state here as well!

  return access_token;
}
```

3. Add authentication to your requests to the Spotify API

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { play } from 'spotify-api-client/player';

const addAuth = createBearerAuthMiddleware({
  token: '<TOKEN>'
});

const client = createClient(fetcher, addAuth);

async () => {
  await play(client);
};
```

### Client credentials flow

Read the [Spotify docs for this flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow).

1. Request an access token from the Spotify accounts service

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBasicAuthMiddleware } from 'spotify-api-client/middleware';

const addAuth = createBasicAuthMiddleware({
  client_id: '<CLIENT_ID>',
  client_secret: '<CLIENT_SECRET>'
});

const client = createClient(fetcher, addAuth);

async function authenticate() {
  try {
    const { body } = await clientCredentials(client);

    const { access_token, expires_in } = body;

    saveTokenSomewhere({ access_token, expires_in });
  } catch (error) {
    console.log(error.message);
  }
}

authenticate();
```

2. Add authentication to your requests to the Spotify API

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { play } from 'spotify-api-client/player';

const addAuth = createBearerAuthMiddleware({
  token: () => getTokenSavedEarlier()
});

const client = createClient(fetcher, addAuth);

async () => {
  await play(client);
};
```

## Creating a custom fetcher

A default `Fetch`-based fetcher can be imported from `spotify-api-client/fetcher`, but it's pretty simple to create your own if you prefer to use another HTTP library.

The role of a fetcher is to take the `RequestConfig` object, execute the request to Spotify and return a promise that resolves with a `Response` object.

The `RequestConfig` and `Response` objects have the following interfaces:

```js
interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  body?: any;
  scheme?: AuthenticationScheme;
  signal?: AbortSignal;
}

interface Response<T = any> {
  body: T;
  status: number;
  headers: any;
  request: RequestConfig;
}
```

You can do anything you like in the fetcher, as long as you return a promise that resolves with a response matching the `Response` interface. You could handle adding authentication headers and bypass middleware altogether if you wanted.

So, a barebones custom fetcher could look something like:

```js
async function fetcher(request: RequestConfig) {
  const { url, method, body, headers, params, scheme } = request;

  if (scheme === 'Bearer') {
    headers['Authorization'] = 'Bearer <MY_ACCESS_TOKEN>';
  }

  try {
    const response = await myHttpFunction(url, { body, headers, params });
    return {
      body: response.body,
      status: response.status,
      headers: response.headers,
      request
    };
  } catch (error) {
    // Do anything you like with the error object here before rethrowing...
    throw error;
  }
}
```

## Error handling

TODO!

## Examples

Example code for a range of scenarios can be found in the [`examples`](examples) directory.

## API Reference

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [`createClient`](#createclient)
- [`composeMiddleware`](#composemiddleware)
- [`createAuthMiddleware`](#createauthmiddleware)
- [`createBasicAuthMiddleware`](#createbasicauthmiddleware)
- [`createBearerAuthMiddleware`](#createbearerauthmiddleware)
- [`paginate`](#paginate)
- [`gather`](#gather)
- [`albums`](#albums)
  - [`getAlbum`](#getalbum)
  - [`getAlbums`](#getalbums)
  - [`getTracksForAlbum`](#gettracksforalbum)
- [`artists`](#artists)
  - [`getAlbumsForArtist`](#getalbumsforartist)
  - [`getArtist`](#getartist)
  - [`getArtists`](#getartists)
  - [`getTopTracksForArtist`](#gettoptracksforartist)
  - [`getRelatedArtistsForArtist`](#getrelatedartistsforartist)
- [`auth`](#auth)
- [`browse`](#browse)
  - [`getCategory`](#getcategory)
  - [`getCategories`](#getcategories)
  - [`getFeaturedPlaylists`](#getfeaturedplaylists)
  - [`getNewReleases`](#getnewreleases)
  - [`getPlaylistsForCategory`](#getplaylistsforcategory)
  - [`getRecommendations`](#getrecommendations)
  - [`getRecommendationGenres`](#getrecommendationgenres)
- [`episodes`](#episodes)
  - [`getEpisode`](#getepisode)
  - [`getEpisodes`](#getepisodes)
- [`follow`](#follow)
  - [`areFollowingPlaylist`](#arefollowingplaylist)
  - [`followArtists`](#followartists)
  - [`followPlaylist`](#followplaylist)
  - [`followUsers`](#followusers)
  - [`getFollowedArtists`](#getfollowedartists)
  - [`isFollowingArtists`](#isfollowingartists)
  - [`isFollowingUsers`](#isfollowingusers)
  - [`unfollowArtists`](#unfollowartists)
  - [`unfollowPlaylist`](#unfollowplaylist)
  - [`unfollowUsers`](#unfollowusers)
- [`library`](#library)
  - [`checkSavedAlbums`](#checksavedalbums)
  - [`checkSavedShows`](#checksavedshows)
  - [`checkSavedTracks`](#checksavedtracks)
  - [`getSavedAlbums`](#getsavedalbums)
  - [`getSavedShows`](#getsavedshows)
  - [`getSavedTracks`](#getsavedtracks)
  - [`removeSavedAlbums`](#removesavedalbums)
  - [`removeSavedShows`](#removesavedshows)
  - [`removeSavedTracks`](#removesavedtracks)
  - [`saveAlbums`](#savealbums)
  - [`saveShows`](#saveshows)
  - [`saveTracks`](#savetracks)
- [`personalization`](#personalization)
  - [`getMyTopArtists`](#getmytopartists)
  - [`getMyTopTracks`](#getmytoptracks)
- [`player`](#player)
  - [`addToPlaybackQueue`](#addtoplaybackqueue)
  - [`getAvailableDevices`](#getavailabledevices)
  - [`getCurrentPlaybackContext`](#getcurrentplaybackcontext)
  - [`getCurrentlyPlayingTrack`](#getcurrentlyplayingtrack)
  - [`getRecentlyPlayedTracks`](#getrecentlyplayedtracks)
  - [`pause`](#pause)
  - [`play`](#play)
  - [`seek`](#seek)
  - [`setVolume`](#setvolume)
  - [`shuffle`](#shuffle)
  - [`skipToNextTrack`](#skiptonexttrack)
  - [`skipToPreviousTrack`](#skiptoprevioustrack)
  - [`transferPlayback`](#transferplayback)
- [`playlists`](#playlists)
  - [`addItemsToPlaylist`](#additemstoplaylist)
  - [`changeDetailsForPlaylist`](#changedetailsforplaylist)
  - [`createPlaylist`](#createplaylist)
  - [`getCoverImageForPlaylist`](#getcoverimageforplaylist)
  - [`getMyPlaylists`](#getmyplaylists)
  - [`getPlaylistsForUser`](#getplaylistsforuser)
  - [`getPlaylist`](#getplaylist)
  - [`listItemsInPlaylist`](#listitemsinplaylist)
  - [`removeItemsFromPlaylist`](#removeitemsfromplaylist)
  - [`reorderItemsInPlaylist`](#reorderitemsinplaylist)
  - [`replaceItemsInPlaylist`](#replaceitemsinplaylist)
  - [`uploadCoverImageForPlaylist`](#uploadcoverimageforplaylist)
- [`search`](#search)
  - [`search`](#search-1)
  - [`searchAlbums`](#searchalbums)
  - [`searchArtists`](#searchartists)
  - [`searchEpisodes`](#searchepisodes)
  - [`searchPlaylists`](#searchplaylists)
  - [`searchShows`](#searchshows)
  - [`searchTracks`](#searchtracks)
- [`shows`](#shows)
  - [`getShow`](#getshow)
  - [`getShows`](#getshows)
  - [`getEpisodesForShow`](#getepisodesforshow)
- [`tracks`](#tracks)
  - [`getAudioAnalysisForTrack`](#getaudioanalysisfortrack)
  - [`getAudioFeaturesForTrack`](#getaudiofeaturesfortrack)
  - [`getAudioFeaturesForTracks`](#getaudiofeaturesfortracks)
  - [`getTrack`](#gettrack)
  - [`getTracks`](#gettracks)
- [`user`](#user)
  - [`me`](#me)
  - [`getUser`](#getuser)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### `createClient`

Creates a client that can be used to execute requests to the Spotify API.

`createClient(fetcher: Fetcher, middleware?: Middleware): Fetcher`

- `fetcher` _Fetcher_ - Async function that takes a `RequestConfig` object, executes the request and returns a `Response` object.
- `middleware` _Middleware_ - Middleware function/s to be executed with each request.

Once created, the client can be passed as the first argument to any endpoint function.

🗒 **Note:** This library deliberately **does not** polyfill `fetch`. If you want to use the default fetcher in a Node env, for example, then you will need to polyfill this yourself.

**Example**

```js
import { createClient, Fetcher, RequestConfig } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import {
  createAuthMiddleware,
  composeMiddleware
} from 'spotify-api-client/middleware';
import { getAlbum } from 'spotify-api-client/albums';

const addAuth = createAuthMiddleware({
  token: '<TOKEN>',
  client_id: '<CLIENT_ID>',
  redirect_uri: '<REDIRECT_URI>'
});

function addLogging(next: Fetcher) {
  return (request: RequestConfig) => {
    console.log(`Making request to ${request.url}`);
    return next(request);
  };
}

const client = createClient(fetcher, composeMiddleware(addAuth, addLogging));

getAlbum(client, { id: '0sNOF9WDwhWunNAHPD3Baj' }).then(({ body: album }) =>
  console.log(album.name)
);
```

### `composeMiddleware`

Composes multiple middleware functions together to be passed as the second argument to `createClient`.

`composeMiddleware(...fns: Middleware[]): Middleware`

- `...fns` _Middleware[]_ - Any number of middleware functions.

Middleware functions are composed right-to-left.

**Example**

```js
import { createClient, Fetcher, RequestConfig } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import {
  createAuthMiddleware,
  composeMiddleware
} from 'spotify-api-client/middleware';

const addAuth = createAuthMiddleware({
  token: '<TOKEN>',
  client_id: '<CLIENT_ID>',
  redirect_uri: '<REDIRECT_URI>'
});

function addLogging(next: Fetcher) {
  return (request: RequestConfig) => {
    console.log(`Making request to ${request.url}`);
    return next(request);
  };
}

const middleware = composeMiddleware(addAuth, addLogging)

const client = createClient(fetcher, middleware;
```

### `createAuthMiddleware`

Composes [`createBasicAuthMiddleware`](#createbasicauthmiddleware) and [`createBearerAuthMiddleware`](#createbearerauthmiddleware) together into a single middleware function.

`createAuthMiddleware(config: AuthMiddlewareConfig): Middleware`

- `config`
  - `token` _string_ | _Function_ - Spotify access token or a function that returns an access token as a string (can be async).
  - `client_id` _string_ - Spotify client ID.
  - `client_secret` _string_ - Spotify client secret.

**Example**

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createAuthMiddleware } from 'spotify-api-client/middleware';

const addAuth = createAuthMiddleware({
  token: '<TOKEN>',
  /**
   * This could also be an async or sync function that returns
   * a string:
  token: () => fetchAccessTokenFromSomewhere(),
  */
  client_id: '<CLIENT_ID>',
  redirect_uri: '<REDIRECT_URI>'
});

const client = createClient(fetcher, addAuth);
```

### `createBasicAuthMiddleware`

Create a middleware function that will add a `Basic` authorization header to the correct requests.

`createBasicAuthMiddleware(config: BasicAuthMiddlewareConfig): Middleware`

- `config`
  - `client_id` _string_ - Spotify client ID.
  - `client_secret` _string_ - Spotify client secret.

**Example**

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBasicAuthMiddleware } from 'spotify-api-client/middleware';

const addBasicAuth = createBasicAuthMiddleware({
  client_id: '<CLIENT_ID>',
  redirect_uri: '<REDIRECT_URI>'
});

const client = createClient(fetcher, addBasicAuth);
```

### `createBearerAuthMiddleware`

Create a middleware function that will add a `Bearer` authorization header to the correct requests.

`createBasicAuthMiddleware(config: BearerAuthMiddlewareConfig): Middleware`

- `config`

  - `token` _string_ | _Function_ - Spotify access token or a function that returns an access token as a string (can be async).

**Example**

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';

const addBearerAuth = createBearerAuthMiddleware({
  token: '<TOKEN>'
  /**
   * This could also be an async or sync function that returns
   * a string:
  token: () => fetchAccessTokenFromSomewhere()
  */
});

const client = createClient(fetcher, addBearerAuth);
```

### `paginate`

Some Spotify API endpoints [support pagination](https://developer.spotify.com/documentation/web-api/#pagination). `paginate` can be used with these endpoints to continuously fetch each new page of results until you've collected all items.

`paginate<T>(fn: T, options?: PaginateOptions): (...args: Parameters<T>) => AsyncGenerator`

- `fn` _Function_ - Spotify endpoint function.
- `options?`
  - `backoff?` _number_ - Duration in ms to wait between each request. Defaults to 0.
  - `maxItems?` _number_ - The maximum number of items to fetch. Defaults to Infinity.
  - `maxRequests?` _number_ - The maximum number of requests to be made. This will take precedence over `maxItems` if both values are supplied. Defaults to Infinity.

**🗒 Notes on using paginate:**

Unlike normal requests that return a `Response` object, only the response body for the given endpoint function will be returned on each iteration. If you pass a function for an endpoint that does not support pagination, the request will be executed as normal and the underlying generator function will just return the response body.

Spotify endpoints that support pagination allow you to pass an optional `limit` parameter to specify the number of items to return in the request. In `paginate` the value you pass here will be used for each request (Spotify's own default for the given endpoint will be applied if you don't provide a value). If you pass a `limit` that is greater than `maxItems`, then `limit` will be reassigned the lower value in order to avoid overfetching.

If you pass any other optional parameters to the endpoint function - for example, some take a `market` field - these will also be included in each subsequent page request.

**Example**

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { paginate } from 'spotify-api-client/pagination';
import { getSavedAlbums } from 'spotify-api-client/library';

const addBearerAuth = createBearerAuthMiddleware({
  token: '<TOKEN>'
});

const client = createClient(fetcher, addBearerAuth);

async function gatherSavedAlbumNames() {
  const pages = paginate(getSavedAlbums)(client);

  const albumNames: string[] = [];

  for await (const page of pages) {
    albumNames.push(...page.items.map(({ album }) => album.name));
  }

  return albumNames;
}

async function gatherSavedAlbumNamesMax3Requests() {
  const pages = paginate(getSavedAlbums, {
    // Stop pagination after the third request.
    maxRequests: 3
  })(client);

  const albumNames: string[] = [];

  for await (const page of pages) {
    albumNames.push(...page.items.map(({ album }) => album.name));
  }

  return albumNames;
}
```

### `gather`

Gather all results from paginating requests into an array. This is a shorthand for the examples above using `paginate`.

`gather<T, U>(fn: T, pick: U, options?: PaginateOptions): (...args: Parameters<T>) => Promise<ReturnType<U>>`

- `fn` _Function_ - Spotify endpoint function.
- `pick` _Function_ - Function that takes a response body and should return the page elements to gather up. If you return an array, those array elements will be spread into the resulting array.
- `options?`
  - `backoff?` _number_ - Duration in ms to wait between each request. Defaults to 0.
  - `maxItems?` _number_ - The maximum number of items to fetch. Defaults to Infinity.
  - `maxRequests?` _number_ - The maximum number of requests to be made. This will take precedence over `maxItems` if both values are supplied. Defaults to Infinity.

**Example**

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { gather } from 'spotify-api-client/pagination';
import { getSavedAlbums } from 'spotify-api-client/library';

const addBearerAuth = createBearerAuthMiddleware({
  token: '<TOKEN>'
});

const client = createClient(fetcher, addBearerAuth);

async function gatherSavedAlbumNames(): Promise<string[]> {
  const albums = await gather(getSavedAlbums, ({ items }) =>
    items.map(({ album }) => album.name)
  )(client);
  return albums;
}
```

### `albums`

Endpoints for retrieving information about one or more albums from the Spotify catalog.

[Read the Spotify docs for these endpoints](https://developer.spotify.com/documentation/web-api/reference/#category-albums)

#### `getAlbum`

Get Spotify catalog information for a single album.

`getAlbum(client: Fetcher, parameters: GetAlbumParameters): GetAlbumResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the album.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/albums/get-album/) for this endpoint.
umResponse`

<details>
<summary><strong>Example</strong></summary>

```js
(async () => {
  import { createClient } from 'spotify-api-client';
  import { fetcher } from 'spotify-api-client/fetcher';
  import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
  import { getAlbum } from 'spotify-api-client/albums';

  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body: album } = await getAlbum(client, {
    id: '0sNOF9WDwhWunNAHPD3Baj',
    market: 'US'
  });

  console.log(`Retrieved album ${album.name}`);
})();
```

</details>

#### `getAlbums`

Get Spotify catalog information for multiple albums identified by their Spotify IDs.

`getAlbums(client: Fetcher, parameters: GetAlbumsParameters): GetAlbumsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify IDs for the albums. Maximum: 20 IDs.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/albums/get-several-albums/) for this endpoint.
umsResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getAlbums } from 'spotify-api-client/albums';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getAlbums(client, {
    ids: [
      '0sNOF9WDwhWunNAHPD3Baj',
      '6JWc4iAiJ9FjyK0B59ABb4',
      '6UXCm6bOO4gFlDQZV5yL37'
    ],
    market: 'US'
  });

  body.albums.forEach((album) => {
    // `album` may be `null` here if the ID at the
    // corresponding position in the `ids` array
    // returned no results.
    if (album) {
      console.log(`Retrieved album ${album.name}`);
    }
  });
})();
```

</details>

#### `getTracksForAlbum`

Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.

`getTracksForAlbum(client: Fetcher, parameters: GetTracksForAlbumParameters): GetTracksForAlbumResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the album.
  - `limit?` _number_ - The maximum number of tracks to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first track to return. Default: 0 (the first object). Use with limit to get the next set of tracks.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/albums/get-albums-tracks/) for this endpoint.
cksForAlbumResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getTracksForAlbum } from 'spotify-api-client/albums';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getTracksForAlbum(client, {
    id: '0sNOF9WDwhWunNAHPD3Baj',
    market: 'US'
  });

  body.items.forEach((track) => console.log(`Retrieved track ${track.name}`));
})();
```

</details>

### `artists`

Endpoints for retrieving information about one or more artists from the Spotify catalog.

#### `getAlbumsForArtist`

Get Spotify catalog information about an artist’s albums. Optional parameters can be specified in the query string to filter and sort the response.

`getAlbumsForArtist(client: Fetcher, parameters: GetAlbumsForArtistParameters): GetAlbumsForArtistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the artist.
  - `include_groups?` _string[]_ - Array of keywords that will be used to filter the response. If not supplied, all album types will be returned. Valid values are: `'album'`, `'single'`, `'appears_on`', `'compilation'`.
  - `country?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`. If not given, results will be returned for all countries and you are likely to get duplicate results per album, one for each country in which the album is available.
  - `limit?` _number_ - The maximum number of albums objects to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first album to return. Default: 0 (the first object). Use with limit to get the next set of albums.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/) for this endpoint.
umsForArtistResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getAlbumsForArtist } from 'spotify-api-client/artists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getAlbumsForArtist(client, {
    id: '0OdUWJ0sBjDrqHygGUXeCF',
    country: 'US'
  });

  body.items.forEach((album) => console.log(`Retrieved album ${album.name}`));
})();
```

</details>

#### `getArtist`

Get Spotify catalog information for a single artist identified by their unique Spotify ID.

`getArtist(client: Fetcher, parameters: GetArtistParameters): GetArtistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the artist.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/artists/get-artist/) for this endpoint.
istResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getArtist } from 'spotify-api-client/artists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getArtist(client, {
    id: '0OdUWJ0sBjDrqHygGUXeCF'
  });

  console.log(`Retrieved artist ${artist.name}`);
})();
```

</details>

#### `getArtists`

Get Spotify catalog information for several artists based on their Spotify IDs.

`getArtists(client: Fetcher, parameters: GetArtistsParameters): GetArtistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify IDs for the artists. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/artists/get-several-artists/) for this endpoint.
istsResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getArtists } from 'spotify-api-client/artists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getArtists(client, {
    ids: ['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']
  });

  body.artists.forEach((artist) => {
    // `artist` may be `null` here if the ID at the
    // corresponding position in the `ids` array
    // returned no results.
    if (artist) {
      console.log(`Retrieved artist ${artist.name}`);
    }
  });
})();
```

</details>

#### `getTopTracksForArtist`

Get Spotify catalog information about an artist’s top tracks by country.

`getTopTracksForArtist(client: Fetcher, parameters: GetTopTracksForArtistParameters): GetTopTracksForArtistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the artist.
  - `market` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-top-tracks/) for this endpoint.
TracksForArtistResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getTopTracksForArtist } from 'spotify-api-client/artists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getTopTracksForArtist(client, {
    id: '0OdUWJ0sBjDrqHygGUXeCF',
    country: 'from_token'
  });

  console.log('Top tracks for artist:');
  body.tracks.forEach((track) => console.log(track.name));
})();
```

</details>

#### `getRelatedArtistsForArtist`

Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community’s listening history.

`getRelatedArtistsForArtist(client: Fetcher, parameters: GetRelatedArtistsForArtistParameters): GetRelatedArtistsForArtistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the artist.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/artists/get-related-artists/) for this endpoint.
atedArtistsForArtistResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getRelatedArtistsForArtist } from 'spotify-api-client/artists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getRelatedArtistsForArtist(client, {
    id: '0OdUWJ0sBjDrqHygGUXeCF'
  });

  console.log('Related artists:');
  body.artists.forEach((artist) => console.log(artist.name));
})();
```

</details>

### `auth`

#### `authorizationCode`

Exchange a Spotify authorization code for an access token.

`authorizationCode(client: Fetcher, parameters: AuthorizationCodeParameters): AuthorizationCodeResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `code` _string_ - Spotify authorization code passed as a search param to your redirect URI.
  - `redirect_uri` _string_ - The redirect URI value provided when requesting the authorization code.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBasicAuthMiddleware } from 'spotify-api-client/middleware';
import { authorizationCode } from 'spotify-api-client/auth';

(async () => {
  const addAuth = createBasicAuthMiddleware({
    client_id: '<CLIENT_ID>',
    client_secret: '<CLIENT_SECRET>'
  });

  const client = createClient(fetcher, addAuth);

  const { body } = await authorizationCode(client, {
    code: '<CODE>'
    redirect_uri: 'https://my.app.com/calback'
  });

  console.log(body.access_token);
})();
```

</details>

#### `authorizationCodeWithPkce`

Exchange a Spotify authorization code for an access token.

`authorizationCodeWithPkce(client: Fetcher, parameters: AuthorizationCodeWithPkceParameters): AuthorizationCodeResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `code` _string_ - Spotify authorization code passed as a search param to your redirect URI.
  - `redirect_uri` _string_ - The redirect URI value provided when requesting the authorization code.
  - `client_id` _string_ - The client ID for your application.
  - `code_verifier` _string_ - The code verifier value generated previously in the auth flow.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBasicAuthMiddleware } from 'spotify-api-client/middleware';
import { authorizationCodeWithPkce } from 'spotify-api-client/auth';

(async () => {
  const addAuth = createBasicAuthMiddleware({
    client_id: '<CLIENT_ID>',
    client_secret: '<CLIENT_SECRET>'
  });

  const client = createClient(fetcher, addAuth);

  const { body } = await authorizationCodeWithPkce(client, {
    client_id: '<CLIENT_ID>',
    code: '<CODE>',
    code_verifier: '<CODE_VERIFIER>',
    redirect_uri: 'https://my.app.com/calback'
  });

  console.log(body.access_token);
})();
```

</details>

#### `clientCredentials`

Obtain an access token using your client ID and client secret.

`clientCredentials(client: Fetcher): ClientCredentialsResponse`

- `client` _Fetcher_ - Client used to execute the request.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBasicAuthMiddleware } from 'spotify-api-client/middleware';
import { clientCredentials } from 'spotify-api-client/auth';

(async () => {
  const addAuth = createBasicAuthMiddleware({
    client_id: '<CLIENT_ID>',
    client_secret: '<CLIENT_SECRET>'
  });

  const client = createClient(fetcher, addAuth);

  const { body } = await clientCredentials(client);

  console.log(body.access_token);
})();
```

</details>

#### `createImplicitGrantUrl`

Create the authorization URL to redirect users to as part of the implicit grant flow.

`createImplicitGrantUrl(parameters: CreateImplicitGrantUrlParameters): string`

- `parameters`

  - `client_id` _string_ - The client ID for your application.
  - `redirect_uri` _string_ - The URI to redirect to after the user grants or denies permission.
  - `state?` _string_ - Optional value to be used for protection against attacks such as cross-site request forgery.
  - `scope?` _string[]_ - Array of Spotify scopes.
  - `show_dialog?` _boolean_ - Whether or not to force the user to approve the app again if they’ve already done so.

<details>
<summary><strong>Example</strong></summary>

```js
import { createImplicitGrantUrl } from 'spotify-api-client/auth';

const url = createImplicitGrantUrl({
  scope: ['user-follow-modify', 'user-read-currently-playing'],
  client_id: '<CLIENT_ID>',
  redirect_uri: 'https://my.app.com/calback',
  state: '<STATE>'
});

console.log(url); // https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=%3CCLIENT_ID%3E&redirect_uri=https%3A%2F%2Fmy.app.com%2Fcalback&state=%3CSTATE%3E&response_type=token
```

</details>

#### `createAuthorizationCodeUrl`

Create the authorization URL to redirect users to as part of the authorization code flow.

`createAuthorizationCodeUrl(parameters: CreateAuthorizationCodeUrlParameters): string`

- `parameters`
  - `client_id` _string_ - The client ID for your application.
  - `redirect_uri` _string_ - The URI to redirect to after the user grants or denies permission.
  - `state?` _string_ - Optional value to be used for protection against attacks such as cross-site request forgery.
  - `scope?` _string[]_ - Array of Spotify scopes.
  - `show_dialog?` _boolean_ - Whether or not to force the user to approve the app again if they’ve already done so.

<details>
<summary><strong>Example</strong></summary>

```js
import { createAuthorizationCodeUrl } from 'spotify-api-client/auth';

const url = createAuthorizationCodeUrl({
  scope: ['user-follow-modify', 'user-read-currently-playing'],
  client_id: '<CLIENT_ID>',
  redirect_uri: 'https://my.app.com/calback',
  state: '<STATE>'
});

console.log(url); // https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=%3CCLIENT_ID%3E&redirect_uri=https%3A%2F%2Fmy.app.com%2Fcalback&state=%3CSTATE%3E&response_type=code
```

</details>

#### `createAuthorizationCodeWithPkceUrl`

Create the authorization URL to redirect users to as part of the authorization code with proof key for code exchange flow.

`createAuthorizationCodeWithPkceUrl(parameters: CreateAuthorizationCodeWithPkceUrlParameters): string`

- `parameters`
  - `client_id` _string_ - The client ID for your application.
  - `redirect_uri` _string_ - The URI to redirect to after the user grants or denies permission.
  - `code_challenge` _string_ - Your `code_verifier` value hashed with the SHA256 algorithm and then base64url encoded.
  - `state?` _string_ - Optional value to be used for protection against attacks such as cross-site request forgery.
  - `scope?` _string[]_ - Array of Spotify scopes.

<details>
<summary><strong>Example</strong></summary>

```js
import { createAuthorizationCodeWithPkceUrl } from 'spotify-api-client/auth';

const url = createAuthorizationCodeWithPkceUrl({
  scope: ['user-follow-modify', 'user-read-currently-playing'],
  client_id: '<CLIENT_ID>',
  redirect_uri: 'https://my.app.com/calback',
  code_challenge: 'YUxVdmtrQmNoRksyOU1Hb0VicHZDcFNYX1ZTM0pMNHJnaGlnOEtwTmtSbw=='
});

console.log(url); // https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=%3CCLIENT_ID%3E&redirect_uri=https%3A%2F%2Fmy.app.com%2Fcalback&code_challenge=YUxVdmtrQmNoRksyOU1Hb0VicHZDcFNYX1ZTM0pMNHJnaGlnOEtwTmtSbw%3D%3D&response_type=code&code_challenge_method=S256
```

</details>

#### `refreshAccessToken`

Obtain a new access token using your refresh token.

`refreshAccessToken(client: Fetcher, parameters: RefreshAccessTokenParameters): RefreshAccessTokenResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `refresh_token` _string_ - Your Spotify refresh token.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBasicAuthMiddleware } from 'spotify-api-client/middleware';
import { refreshAccessToken } from 'spotify-api-client/auth';

(async () => {
  const addAuth = createBasicAuthMiddleware({
    client_id: '<CLIENT_ID>',
    client_secret: '<CLIENT_SECRET>'
  });

  const client = createClient(fetcher, addAuth);

  const { body } = await refreshAccessToken(client, {
    refresh_token: '<REFRESH_TOKEN>'
  });

  console.log(body.access_token);
})();
```

### `browse`

#### `getCategory`

Get a single category used to tag items in Spotify.

`getCategory(client: Fetcher, parameters: GetCategoryParameters): GetCategoryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `category_id` _string_ - The Spotify category ID for the category.
  - `country?` _string_ - ISO 3166-1 alpha-2 country code. Provide this parameter to ensure that the category exists for a particular country.
  - `locale?` _string_ - The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the category strings returned in a particular language. Note that, if locale is not supplied, or if the specified language is not available, the category strings returned will be in the Spotify default language (American English).

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/browse/get-category/) for this endpoint.
egoryResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getCategory } from 'spotify-api-client/browse';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getCategory(client, {
    category_id: 'party',
    country: 'US'
  });

  console.log(`Found category ${body.name}`);
})();
```

</details>

#### `getCategories`

Get a list of categories used to tag items in Spotify.

`getCategories(client: Fetcher, parameters: GetCategoriesParameters): GetCategoriesResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `country?` _string_ - ISO 3166-1 alpha-2 country code. Provide this parameter to ensure that the category exists for a particular country.
  - `locale?` _string_ - The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the category strings returned in a particular language. Note that, if locale is not supplied, or if the specified language is not available, the category strings returned will be in the Spotify default language (American English).
  - `limit?` _number_ - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first item to return. Default: 0 (the first object). Use with limit to get the next set of items.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/browse/get-list-categories/) for this endpoint.
egoriesResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getCategories } from 'spotify-api-client/browse';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getCategories(client, {
    country: 'DE',
    locale: 'de_DE',
    limit: 30
  });

  console.log(`Found ${body.categories.total} categories.`);
})();
```

</details>

#### `getFeaturedPlaylists`

Get a list of Spotify featured playlists.

`getFeaturedPlaylists(client: Fetcher, parameters?: GetFeaturedPlaylistsParameters): GetFeaturedPlaylistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `locale?` _string_ - The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the category strings returned in a particular language. Note that, if locale is not supplied, or if the specified language is not available, the category strings returned will be in the Spotify default language (American English).
  - `country?` _string_ - ISO 3166-1 alpha-2 country code. Provide this parameter to ensure that the category exists for a particular country.
  - `timestamp?` _string_ - A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss. Use this parameter to specify the user’s local time to get results tailored for that specific date and time in the day. If not provided, the response defaults to the current UTC time.
  - `limit?` _number_ - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first item to return. Default: 0 (the first object). Use with limit to get the next set of items.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/browse/get-list-categories/) for this endpoint.
turedPlaylistsResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getFeaturedPlaylists } from 'spotify-api-client/browse';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getFeaturedPlaylists(client, {
    country: 'DE',
    locale: 'de_DE',
    timestamp: '2020-06-01T09:00:00',
    limit: 30
  });

  console.log(body.message);
})();
```

</details>

#### `getNewReleases`

Get a list of new album releases featured in Spotify.

`getNewReleases(client: Fetcher, parameters?: GetNewReleasesParameters): GetNewReleasesResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `country?` _string_ - ISO 3166-1 alpha-2 country code. Provide this parameter to ensure that the category exists for a particular country.
  - `limit?` _number_ - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first item to return. Default: 0 (the first object). Use with limit to get the next set of items.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/browse/get-list-new-releases/) for this endpoint.
ReleasesResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getNewReleases } from 'spotify-api-client/browse';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getNewReleases(client, {
    country: 'US',
    limit: 30
  });

  console.log(body.message);
})();
```

</details>

#### `getPlaylistsForCategory`

Get a list of Spotify playlists tagged with a particular category.

`getPlaylistsForCategory(client: Fetcher, parameters: GetPlaylistsForCategoryParameters): GetPlaylistsForCategoryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `category_id` _string_ - The Spotify category ID for the category.
  - `country?` _string_ - ISO 3166-1 alpha-2 country code. Provide this parameter to ensure that the category exists for a particular country.
  - `limit?` _number_ - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first item to return. Default: 0 (the first object). Use with limit to get the next set of items.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/browse/get-categorys-playlists/) for this endpoint.
ylistsForCategoryResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getPlaylistsForCategory } from 'spotify-api-client/browse';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getPlaylistsForCategory(client, {
    category_id: 'party',
    country: 'US'
  });

  console.log(`Found ${body.playlists.total} playlists.`);
})();
```

</details>

#### `getRecommendations`

Recommendations are generated based on the available information for a given seed entity and matched against similar artists and tracks. If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details.

`getRecommendations(client: Fetcher, parameters?: GetRecommendationsParameters): GetRecommendationsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `max_*?` _number_ - A hard ceiling value for any of the available tunable track attributes. Check the Spotify documentation for available attributes.
  - `min_*?` _number_ - A hard floor value for any of the available tunable track attributes. Check the Spotify documentation for available attributes.
  - `seed_artists?` _string[]_ - Array of Spotify IDs for seed artists.
  - `seed_genres?` _string[]_ - Array of seed genres.
  - `seed_tracks?` _string[]_ - Array Spotify IDs for seed tracks.
  - `target_*?` _number_ - A target value for any of the available tunable track attributes. Check the Spotify documentation for available attributes.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/) for this endpoint.
ommendationsResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getRecommendations } from 'spotify-api-client/browse';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getRecommendations(client, {
    limit: 10,
    market: 'US',
    max_acousticness: 0.6,
    max_energy: 0.9,
    target_key: 0,
    min_liveness: 0.2,
    seed_artists: ['4NHQUGzhtTLFvgF5SZesLK'],
    seed_tracks: ['0c6xIDDpzE81m2q797ordA']
  });

  console.log(`Found ${body.tracks.length} recommendations`);
})();
```

</details>

#### `getRecommendationGenres`

Retrieve a list of available genres seed parameter values for recommendations.

`getRecommendations(client: Fetcher): GetRecommendationGenresResponse`

- `client` _Fetcher_ - Client used to execute the request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/) for this endpoint.
ommendationGenresResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getRecommendationGenres } from 'spotify-api-client/browse';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getRecommendationGenres(client);

  body.genres.forEach((genre) => console.log(genre));
})();
```

</details>

### `episodes`

#### `getEpisode`

Endpoints for retrieving information about one or more episodes from the Spotify catalog.

`getEpisode(client: Fetcher, parameters: GetEpisodeParameters): GetEpisodeResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the episode.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/episodes/get-an-episode/) for this endpoint.
sodeResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getEpisode } from 'spotify-api-client/episodes';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getEpisode(client, {
    id: '512ojhOuo1ktJprKbVcKyQ',
    market: 'US'
  });

  console.log(`Found episode ${body.name}`);
})();
```

</details>

#### `getEpisodes`

Get Spotify catalog information for multiple episodes based on their Spotify IDs.

`getEpisodes(client: Fetcher, parameters: GetEpisodesParameters): GetEpisodesResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of the Spotify IDs for the episodes. Maximum: 50 IDs.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/episodes/get-several-episodes/) for this endpoint.
sodesResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getEpisodes } from 'spotify-api-client/episodes';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getEpisodes(client, {
    ids: ['77o6BIVlYM3msb4MMIL1jH', '0Q86acNRm6V9GYx55SXKwf'],
    market: 'US'
  });

  body.episodes.forEach((episode) => {
    // `episode` may be `null` here if the ID at the
    // corresponding position in the `ids` array
    // returned no results.
    if (episode) {
      console.log(`Found episode ${episode.name}`);
    }
  });
})();
```

</details>

### `follow`

#### `areFollowingPlaylist`

Check to see if one or more Spotify users are following a specified playlist.

`areFollowingPlaylist(client: Fetcher, parameters: AreFollowingPlaylistParameters): AreFollowingPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID of the playlist.
  - `ids` _string[]_ - Array of Spotify user IDs to check. Maximum 5 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/check-user-following-playlist/) for this endpoint.
lowingPlaylistResponse` sodesResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { areFollowingPlaylist } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const ids = ['user1', 'user2'];

  const { body } = await areFollowingPlaylist(client, {
    playlist_id: '2v3iNvBX8Ay1Gt2uXtUKUT',
    ids
  });

  body.forEach((bool, index) => {
    // Response body will be an array of boolean values indicating
    // whether the playlist is followed by the user at the corresponding
    // index in the ids array.
    if (bool) {
      console.log(`User ${ids[index]} is following the playlist!`);
    }
  });
})();
```

</details>

#### `followArtists`

Add the current user as a follower of one or more Spotify artists.

`followArtists(client: Fetcher, parameters: FollowArtistsOrUsersParameters): FollowArtistsOrUsersResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify artist IDs. A maximum of 50 IDs can be sent in one request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { followArtists } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await followArtists(client, {
    ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
  });
})();
```

</details>

#### `followPlaylist`

Add the current user as a follower of a playlist.

`followPlaylist(client: Fetcher, parameters: FollowPlaylistParameters): FollowPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID of the playlist.
  - `public?` _boolean_ - If `true` the playlist will be included in the user’s public playlists, if `false` it will remain private.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/follow-playlist/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { followPlaylist } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await followPlaylist(client, {
    playlist_id: '2v3iNvBX8Ay1Gt2uXtUKUT'
  });
})();
```

</details>

#### `followUsers`

Add the current user as a follower of one or more Spotify users.

`followUsers(client: Fetcher, parameters: FollowArtistsOrUsersParameters): FollowArtistsOrUsersResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify user IDs. A maximum of 50 IDs can be sent in one request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/follow-artists-users/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { followUsers } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await followUsers(client, {
    ids: ['user1', 'user2']
  });
})();
```

</details>

#### `getFollowedArtists`

Get the current user's followed artists.

`getFollowedArtists(client: Fetcher, parameters?: GetFollowedArtistsParameters): GetFollowedArtistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _string_ - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
  - `after?` _string_ - The last artist ID retrieved from the previous request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/get-followed/) for this endpoint.
lowedArtistsResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getFollowedArtists } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getFollowedArtists(client, { limit: 10 });

  body.items.forEach((artist) =>
    console.log(`User is following ${artist.name}!`)
  );
})();
```

#### `isFollowingArtists`

Check if the current user is following one or more Spotify artists.

`isFollowingArtists(client: Fetcher, parameters: IsFollowingArtistsOrUsersParameters): IsFollowingArtistsOrUsersResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify artist IDs to check. A maximum of 50 IDs can be sent in one request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/check-current-user-follows/) for this endpoint.
owingArtistsOrUsersResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { isFollowingArtists } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const ids = ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q'];

  const { body } = await isFollowingArtists(client, { ids });

  body.forEach((bool, index) => {
    // Response body will be an array of boolean values indicating
    // whether the user is following the artist at the corresponding
    // index in the ids array.
    if (bool) {
      console.log(`User is following artist with ID ${ids[index]}`);
    }
  });
})();
```

</details>

#### `isFollowingUsers`

Check if the current user is following one or more Spotify users.

`isFollowingUsers(client: Fetcher, parameters: IsFollowingArtistsOrUsersParameters): IsFollowingArtistsOrUsersResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify user IDs to check. A maximum of 50 IDs can be sent in one request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/check-current-user-follows/) for this endpoint.
owingArtistsOrUsersResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { isFollowingUsers } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const ids = ['user1', 'user2'];

  const { body } = await isFollowingUsers(client, { ids });

  body.forEach((bool, index) => {
    // Response body will be an array of boolean values indicating
    // whether the user is following the user at the corresponding
    // index in the ids array.
    if (bool) {
      console.log(`User is following user with ID ${ids[index]}`);
    }
  });
})();
```

</details>

#### `unfollowArtists`

Remove the current user as a follower of one or more Spotify artists.

`unfollowArtists(client: Fetcher, parameters: UnfollowArtistsOrUsersParameters): UnfollowArtistsOrUsersParameters`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify artist IDs. A maximum of 50 IDs can be sent in one request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/unfollow-artists-users/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { unfollowArtists } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await unfollowArtists(client, {
    ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
  });
})();
```

</details>

#### `unfollowPlaylist`

Remove the current user as a follower of a playlist.

`unfollowPlaylist(client: Fetcher, parameters: UnfollowPlaylistParameters): UnfollowPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID of the playlist.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/unfollow-playlist/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { unfollowPlaylist } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await unfollowPlaylist(client, {
    playlist_id: '2v3iNvBX8Ay1Gt2uXtUKUT'
  });
})();
```

</details>

#### `unfollowUsers`

Remove the current user as a follower of one or more Spotify users.

`unfollowUsers(client: Fetcher, parameters: UnfollowArtistsOrUsersParameters): UnfollowArtistsOrUsersParameters`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify user IDs. A maximum of 50 IDs can be sent in one request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/follow/unfollow-artists-users/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { unfollowUsers } from 'spotify-api-client/follow';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await unfollowUsers(client, {
    ids: ['user1', 'user2']
  });
})();
```

</details>

### `library`

Endpoints for retrieving information about, and managing, tracks that the current user has saved in their 'Your Music' library.

#### `checkSavedAlbums`

Check if one or more albums are already saved in the current Spotify user's 'Your Music' library.

`checkSavedAlbums(client: Fetcher, parameters: CheckLibraryParameters): CheckLibraryResponse`

- `parameters`
  - `ids` _string[]_ - Array of Spotify album IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-albums/) for this endpoint.
ibraryResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { checkSavedAlbums } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const ids = ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0'];

  const { body } = await checkSavedAlbums(client, { ids });

  body.forEach((bool, index) => {
    // Response body will be an array of boolean values indicating
    // whether the album at the corresponding index in the ids array
    // is saved in the current user's library.
    if (bool) {
      console.log(`User's library contains album ID ${ids[index]}!`);
    }
  });
})();
```

</details>

#### `checkSavedShows`

Check if one or more shows are already saved in the current Spotify user's 'Your Music' library.

`checkSavedShows(client: Fetcher, parameters: CheckLibraryParameters): CheckLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify show IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-shows/) for this endpoint.
ibraryResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { checkSavedShows } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const ids = ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0'];

  const { body } = await checkSavedShows(client, { ids });

  body.forEach((bool, index) => {
    // Response body will be an array of boolean values indicating
    // whether the show at the corresponding index in the ids array
    // is saved in the current user's library.
    if (bool) {
      console.log(`User's library contains show ID ${ids[index]}!`);
    }
  });
})();
```

</details>

#### `checkSavedTracks`

Check if one or more tracks are already saved in the current Spotify user's 'Your Music' library.

`checkSavedTracks(client: Fetcher, parameters: CheckLibraryParameters): CheckLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify track IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-tracks/) for this endpoint.
ibraryResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { checkSavedTracks } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const ids = ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0'];

  const { body } = await checkSavedTracks(client, { ids });

  body.forEach((bool, index) => {
    // Response body will be an array of boolean values indicating
    // whether the track at the corresponding index in the ids array
    // is saved in the current user's library.
    if (bool) {
      console.log(`User's library contains track ID ${ids[index]}!`);
    }
  });
})();
```

</details>

#### `getSavedAlbums`

Get a list of the albums saved in the current Spotify user's 'Your Music' library.

`getSavedAlbums(client: Fetcher, parameters?: GetSavedAlbumsParameters): GetSavedAlbumsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first object to return. Default: 0 (i.e., the first object). Use with `limit` to get the next set of objects.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-albums/) for this endpoint.
edAlbumsResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getSavedAlbums } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getSavedAlbums(client);

  console.log(`User's library contains ${body.total} saved albums!`);
})();
```

</details>

#### `getSavedShows`

Get a list of the shows saved in the current Spotify user's 'Your Music' library.

`getSavedShows(client: Fetcher, parameters?: GetSavedShowsParameters): GetSavedShowsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first object to return. Default: 0 (i.e., the first object). Use with `limit` to get the next set of objects.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-shows/) for this endpoint.
edShowsResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getSavedShows } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getSavedShows(client);

  console.log(`User's library contains ${body.total} saved shows!`);
})();
```

</details>

#### `getSavedTracks`

Get a list of the tracks saved in the current Spotify user's 'Your Music' library.

`getSavedTracks(client: Fetcher, parameters?: GetSavedTracksParameters): GetSavedTracksResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first object to return. Default: 0 (i.e., the first object). Use with `limit` to get the next set of objects.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-tracks/) for this endpoint.
edTracksResponse`

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getSavedTracks } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getSavedTracks(client);

  console.log(`User's library contains ${body.total} saved tracks!`);
})();
```

</details>

#### `removeSavedAlbums`

Remove one or more albums from the current user's 'Your Music' library.

Changes to a user’s saved albums may not be visible in other Spotify applications immediately.

`removeSavedAlbums(client: Fetcher, parameters: RemoveSavedAlbumsParameters): RemoveFromLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify album IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/remove-albums-user/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { removeSavedAlbums } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await removeSavedAlbums(client, {
    ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
  });
})();
```

</details>

#### `removeSavedShows`

Remove one or more shows from the current user's 'Your Music' library.

Changes to a user's saved shows may not be visible in other Spotify applications immediately.

`removeSavedShows(client: Fetcher, parameters: RemoveSavedShowsParameters): RemoveFromLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify show IDs. Maximum: 50 IDs.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/remove-shows-user/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { removeSavedShows } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await removeSavedShows(client, {
    ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
  });
})();
```

</details>

#### `removeSavedTracks`

Remove one or more tracks from the current user's 'Your Music' library.

Changes to a user's saved tracks may not be visible in other Spotify applications immediately.

`removeSavedTracks(client: Fetcher, parameters: RemoveSavedTracksParameters): RemoveFromLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify track IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/remove-tracks-user/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { removeSavedTracks } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await removeSavedTracks(client, {
    ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
  });
})();
```

</details>

#### `saveAlbums`

Save one or more albums to the current user's 'Your Music' library.

`saveAlbums(client: Fetcher, parameters: SaveToLibraryParameters): SaveToLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify album IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/save-albums-user/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { saveAlbums } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await saveAlbums(client, {
    ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
  });
})();
```

</details>

#### `saveShows`

Save one or more shows to the current user's 'Your Music' library.

`saveShows(client: Fetcher, parameters: SaveToLibraryParameters): SaveToLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify show IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/save-shows-user/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { saveShows } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await saveShows(client, {
    ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
  });
})();
```

</details>

#### `saveTracks`

Save one or more tracks to the current user's 'Your Music' library.

`saveTracks(client: Fetcher, parameters: SaveToLibraryParameters): SaveToLibraryResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify track IDs. Maximum: 50 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/library/save-tracks-user/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { saveTracks } from 'spotify-api-client/library';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await saveTracks(client, {
    ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
  });
})();
```

</details>

### `personalization`

Endpoints for retrieving information about the user's listening habits.

#### `getMyTopArtists`

Get the current user's top artists based on calculated affinity.

`getMyTopArtists(client: Fetcher, parameters?: GetMyTopArtistsOrTracksParameters): GetMyTopArtistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The number of entities to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first entity to return. Default: 0 (i.e., the first artist). Use with `limit` to get the next set of entities.
  - `time_range?` _string_ - Over what time frame the affinities are computed. Valid values are `'short_term'` (calculated from several years of data and including all new data as it becomes available), `'medium_term'` (approximately last 6 months) or `'long_term'` (approximately last 4 weeks).

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getMyTopArtists } from 'spotify-api-client/personalization';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getMyTopArtists(client, {
    limit: 10,
    time_range: 'short_term'
  });

  body.items.forEach((artist) => console.log(artist.name));
})();
```

</details>

#### `getMyTopTracks`

Get the current user's top tracks based on calculated affinity.

`getMyTopTracks(client: Fetcher, parameters?: GetMyTopArtistsOrTracksParameters): GetMyTopArtistsOrTracksParameters`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The number of entities to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _number_ - The index of the first entity to return. Default: 0 (i.e., the first track). Use with `limit` to get the next set of entities.
  - `time_range?` _string_ - Over what time frame the affinities are computed. Valid values are `'short_term'` (calculated from several years of data and including all new data as it becomes available), `'medium_term'` (approximately last 6 months) or `'long_term'` (approximately last 4 weeks).

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getMyTopTracks } from 'spotify-api-client/personalization';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getMyTopTracks(client, {
    limit: 10,
    time_range: 'short_term'
  });

  body.items.forEach((track) => console.log(track.name));
})();
```

</details>

### `player`

#### `addToPlaybackQueue`

Add an item to the user's playback queue.

`addToPlaybackQueue(client: Fetcher, parameters: AddToPlaybackQueueParameters): AddToPlaybackQueueResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `uri` _string_ - The uri of the item to add to the queue.
    Must be a track or an episode uri.
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/add-to-queue/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { addToPlaybackQueue } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await addToPlaybackQueue(client, {
    uri: 'spotify:track:4sFB5UbO5J09RslzqSBpJS'
  });

  console.log('Added to queue!');
})();
```

</details>

#### `getAvailableDevices`

Get a user's available devices.

`getAvailableDevices(client: Fetcher): GetAvailableDevicesResponse`

- `client` _Fetcher_ - Client used to execute the request.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/get-a-users-available-devices/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getAvailableDevices } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getAvailableDevices(client);

  console.log(`Found ${body.devices.length} available device/s`);
})();
```

</details>

#### `getCurrentPlaybackContext`

Get information about the user’s current playback state, including track or episode, progress, and active device.

`getCurrentPlaybackContext(client: Fetcher, parameters?: GetCurrentPlaybackContextParameters): GetAvailableDevicesResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `additional_types?` _string[]_ - Array of item types that your client supports besides the default `'track'` type. Valid types are: `'track'` and `'episode'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/get-information-about-the-users-current-playback/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getCurrentPlaybackContext } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getCurrentPlaybackContext(client, {
    market: 'US'
  });

  console.log(`Current active device: ${body.device.name}`);
})();
```

</details>

#### `getCurrentlyPlayingTrack`

Get the object currently being played on the user’s Spotify account.

`getCurrentlyPlayingTrack(client: Fetcher, parameters?: GetCurrentlyPlayingTrackParameters): GetCurrentlyPlayingTrackResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `additional_types?` _string[]_ - Array of item types that your client supports besides the default `'track'` type. Valid types are: `'track'` and `'episode'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getCurrentlyPlayingTrack } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getCurrentlyPlayingTrack(client, {
    market: 'US'
  });

  console.log(`Currently playing ${body.item.name}`);
})();
```

</details>

#### `getRecentlyPlayedTracks`

Get the current user’s recently played tracks.

`getRecentlyPlayedTracks(client: Fetcher, parameters?: GetRecentlyPlayedTracksParameters): GetRecentlyPlayedTracksResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
  - `after?` _number_ - A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position. If after is specified, before must not be specified.
  - `before?` _number_ - A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position. If before is specified, after must not be specified.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getRecentlyPlayedTracks } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getRecentlyPlayedTracks(client, {
    limit: 50,
    after: 1591037279330
  });

  body.items.forEach(({ track, played_at }) =>
    console.log(`Played ${track.name} at ${played_at}`)
  );
})();
```

</details>

#### `pause`

Pause playback on the user's account.

`pause(client: Fetcher, parameters?: PauseParameters): PauseResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/pause-a-users-playback/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { pause } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await pause(client, {
    device_id: '3f228e06c8562e2f439e22932da6c3231715ed53'
  });

  console.log('Paused playback!');
})();
```

</details>

#### `play`

Start or resume current playback on the user’s active device.

`pause(client: Fetcher, parameters?: PlayParameters): PlayResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `context_uri?` _string_ - Spotify URI of the context to play. Valid contexts are albums, artists, playlists. Example: `{ context_uri: 'spotify:album:1Je1IMUlBXcx1Fz0WE7oPT' }`
  - `uris?` _string[]_ - An array of the Spotify track URIs to play. For example: `{ uris: ['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'] } }`
  - `offset?` _Object_ - Indicates from where in the context playback should start. Only available when context_uri corresponds to an album or playlist object, or when the uris parameter is used. Example: `{ offset: { position 5 } }` or `{ offset: { uri: 'spotify:track:1301WleyT98MSxVHPZCA6M' } }`
  - `position_ms?` _number_ - Indicates from what position to start playback. Must be a positive number.
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Only one of either `context_uri` or `uris` can be specified. If neither is present, calling `play` will resume playback. If both are present the request will return 400 BAD REQUEST.

If `context_uri` is a Playlist or Album, or when `uris` is provided, then `offset` can be added to specify starting track in the context.

If the provided `context_uri` corresponds to an album or playlist object, an `offset` can be specified either by track `uri` OR `position`. If both are present the request will return 400 BAD REQUEST. If incorrect values are provided for `position` or `uri`, the request may be accepted but with an
unpredictable resulting action on playback.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { play } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  // Calling with no args or just a device_id will simply resume playback.
  await play(client);
  console.log('Resumed playback!');

  // Calling with the context_uri parameter will start playback for that
  // context.
  await play(client, {
    context_uri: 'spotify:album:1Je1IMUlBXcx1Fz0WE7oPT'
  });
  console.log('Started playback!');

  // Calling with context_uri and offset parameters will start playback
  // for that context at the specified offset.
  await play(client, {
    context_uri: 'spotify:album:1Je1IMUlBXcx1Fz0WE7oPT',
    offset: {
      uri: 'spotify:track:1301WleyT98MSxVHPZCA6M'
    }
  });
  console.log('Started playback at specified track!');

  // Passing the position_ms option will start playback at the specified
  // ms position within track, for example.
  await play(client, {
    context_uri: 'spotify:album:1Je1IMUlBXcx1Fz0WE7oPT',
    offset: {
      uri: 'spotify:track:1301WleyT98MSxVHPZCA6M'
    },
    position_ms: 25000
  });
  console.log(`Started playback at specified track at position ${25000}ms!`);
})();
```

</details>

#### `repeat`

Set the repeat mode for the user’s playback.

`repeat(client: Fetcher, parameters: RepeatParameters): RepeatResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `state` _string_ - One of 'track', 'context' or 'off'. track' will repeat the current track. 'context' will repeat the current context. 'off' will turn repeat off.
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/set-repeat-mode-on-users-playback/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { repeat } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await repeat(client, {
    state: 'track'
  });

  console.log('Activated repeat for current track!');
})();
```

</details>

#### `seek`

Seeks to the given position in the user's currently playing track.

`seek(client: Fetcher, parameters: SeekParameters): SeekResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `position_ms` _number_ - The position in milliseconds to seek to. Must be a positive number. Passing in a position that is greater than the length of the track will cause the player to start playing the next song.
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/seek-to-position-in-currently-playing-track/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { seek } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const pos = 5000;

  await seek(client, {
    position_ms: pos
  });

  console.log(`Skipped to position at ${pos}ms in current track!`);
})();
```

</details>

#### `setVolume`

Set the volume for the user's current playback device.

`setVolume(client: Fetcher, parameters: SetVolumeParameters): SetVolumeResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `volume_percent` _number_ - The volume to set. Must be a value from 0 to 100 inclusive.
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/set-volume-for-users-playback/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { setVolume } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const percent = 100;

  await setVolume(client, {
    volume_percent: percent
  });

  console.log(`Set volume to ${percent}%!`);
})();
```

</details>

#### `shuffle`

Toggle shuffle on or off for the user's playback.

`shuffle(client: Fetcher, parameters: ShuffleParameters): ShuffleResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `state` _boolean_ - `true`: Shuffle user’s playback or `false`: Do not shuffle user’s playback.
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/toggle-shuffle-for-users-playback/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { shuffle } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await shuffle(client, {
    state: true
  });

  console.log('Toggle playback shuffle!');
})();
```

</details>

#### `skipToNextTrack`

Skip to the next track in the user's queue.

`skipToNextTrack(client: Fetcher, parameters?: SkipTrackParameters): SkipTrackResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/skip-users-playback-to-next-track/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { skipToNextTrack } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await skipToNextTrack(client);

  console.log(`Skipped to next track!`);
})();
```

</details>

#### `skipToPreviousTrack`

Skips to the previous track in the user's queue.

`skipToPreviousTrack(client: Fetcher, parameters?: SkipTrackParameters): SkipTrackResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `device_id?` _string_ - The id of the device this command is targeting. If not supplied, the user’s currently active device is the target.

Note that this will always skip to the previous track, regardless of the current track’s progress. Returning to the start of the current track should be performed using [`seek()`](#seek).

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/skip-users-playback-to-previous-track/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { skipToPreviousTrack } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await skipToPreviousTrack(client);

  console.log(`Skipped to previous track!`);
})();
```

</details>

#### `transferPlayback`

Transfer playback to a new device and determine if it should start playing.

`transferPlayback(client: Fetcher, parameters?: TransferPlaybackParameters): TransferPlaybackResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `device_ids` _string[]_ - Array containing the ID of the device on which playback should be started/transferred. For example: `{ device_ids: ['74ASZWbe4lXaubB36ztrGX'] }` Note: Although an array is accepted, only a single device_id is currently supported. Supplying more than one will return 400 Bad Request.
  - `play?` _boolean_ - `true`: ensure playback happens on new device. `false` or not provided: keep the current playback state.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { transferPlayback } from 'spotify-api-client/player';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await transferPlayback(client, {
    device_ids: ['74ASZWbe4lXaubB36ztrGX'],
    play: true
  });

  console.log('Transferred playback to new device!');
})();
```

### `playlists`

#### `addItemsToPlaylist`

Add one or more items to a user's playlist.

`addItemsToPlaylist(client: Fetcher, parameters: AddItemsToPlaylistParameters): AddItemsToPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID for the playlist.
  - `uris` _string[]_ - Array of Spotify URIs to add.A maximum of 100 can be added in a single request.
  - `position?` _number_ - The position to insert the items at, a zero-based index.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/add-tracks-to-playlist/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { addItemsToPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await addItemsToPlaylist(client, {
    playlist_id: '7oi0w0SLbJ4YyjrOxhZbUv',
    uris: [
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
      'spotify:track:1301WleyT98MSxVHPZCA6M',
      'spotify:episode:512ojhOuo1ktJprKbVcKyQ'
    ],
    position: 3
  });

  console.log(`Playlist snapshot ID: ${body.snapshot_id}`);
})();
```

</details>

#### `changeDetailsForPlaylist`

Change a playlist's name and public/private state. The user must be the owner of the playlist.

`changeDetailsForPlaylist(client: Fetcher, parameters: ChangeDetailsForPlaylistParameters): ChangeDetailsForPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID for the playlist.
  - `name?` _string_ - The new name for the playlist.
  - `public?` _boolean_ - If `true` the playlist will be public, if `false` it will be private.
  - `collaborative?` _boolean_ - If `true`, the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client. Note: You can only set collaborative to true on non-public playlists.
  - `description?` _string_ - Value for playlist description as displayed in Spotify clients and in the Web API.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/change-playlist-details/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { changeDetailsForPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await changeDetailsForPlaylist(client, {
    playlist_id: '7oi0w0SLbJ4YyjrOxhZbUv',
    name: 'My playlist',
    description: 'A playlist',
    public: false
  });
})();
```

</details>

#### `createPlaylist`

Create a playlist for a Spotify user. The playlist will be empty until you add tracks.

`createPlaylist(client: Fetcher, parameters: CreatePlaylistParameters): CreatePlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID for the playlist.
  - `name` _string_ - The playlist name.
  - `public?` _boolean_ - If `true` the playlist will be public, if `false` it will be private.
  - `collaborative?` _boolean_ - If `true`, the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client. Note: You can only set collaborative to true on non-public playlists.
  - `description?` _string_ - Value for playlist description as displayed in Spotify clients and in the Web API.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { createPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await createPlaylist(client, {
    playlist_id: '7oi0w0SLbJ4YyjrOxhZbUv',
    name: 'My playlist',
    description: 'A playlist',
    public: false
  });

  console.log(`Created playlist with ID: ${body.id}`);
})();
```

</details>

#### `getCoverImageForPlaylist`

Get the current image associated with a specific playlist.

`getCoverImageForPlaylist(client: Fetcher, parameters: GetCoverImageForPlaylistParameters): GetCoverImageForPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `parameters.playlist_id` _string_ - The Spotify user ID.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist-cover/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getCoverImageForPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getCoverImageForPlaylist(client, {
    playlist_id: '59ZbFPES4DQwEjBpWHzrtC'
  });

  // An array of images is returned for the cover at various
  // different sizes.
  body.forEach((image) => console.log(`Image URL: ${image.url}`));
})();
```

</details>

#### `getMyPlaylists`

Get a list of the playlists owned or followed by the current Spotify user.

`getMyPlaylists(client: Fetcher, parameters?: GetMyPlaylistsParameters): GetPlaylistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters?`
  - `limit?` _number_ - The maximum number of playlists to return. Default: 20. Minimum: 1.
  - `offset?` _number_ - The index of the first playlist to return. Default: 0 (the first object). Use with `limit` to get the next set of playlists.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getMyPlaylists } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getMyPlaylists(client);

  console.log(`Found ${body.total} playlists!`);
})();
```

</details>

#### `getPlaylistsForUser`

Get a list of the playlists owned or followed by a Spotify user.

`getPlaylistsForUser(client: Fetcher, parameters: GetPlaylistsForUserParameters): GetPlaylistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `user_id` _string_ - The Spotify user ID.
  - `limit?` _number_ - The maximum number of playlists to return. Default: 20. Minimum: 1.
  - `offset?` _number_ - The index of the first playlist to return. Default: 0 (the first object). Use with `limit` to get the next set of playlists.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-list-users-playlists) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getPlaylistsForUser } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const user = 'user_1';

  const { body } = await getPlaylistsForUser(client, { user_id: user });

  console.log(`Found ${body.total} playlists for ${user}!`);
})();
```

</details>

#### `getPlaylist`

Get a playlist owned by a Spotify user.

`getPlaylist(client: Fetcher, parameters: GetPlaylistParameters): GetPlaylistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify user ID.
  - `fields?` _string[]_ - Filters for the query: Array of fields to return. If omitted, all fields are returned.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `additional_types?` _string[]_ - Array of item types that your client supports besides the default track type. Valid types are: `'track'` and `'episode'`.

**🗒 Note:** The optional `fields` parameter allows you to selectively pick off only the fields you want to be present on the returned playlist object in the response body. For TypeScript users, the response body type will currently always be the full `PlaylistObject` though. Check the Spotify docs for more information on how to use this `fields` parameter.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getPlaylist(client, {
    playlist_id: '59ZbFPES4DQwEjBpWHzrtC'
  });

  console.log(`Retrieved playlist ${body.name}!`);
})();
```

</details>

#### `listItemsInPlaylist`

Get full details of the tracks or episodes of a playlist owned by a Spotify user.

`listItemsInPlaylist(client: Fetcher, parameters: ListItemsInPlaylistParameters): ListItemsInPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify user ID.
  - `fields?` _string[]_ - Filters for the query: Array of fields to return. If omitted, all fields are returned.
  - `limit?` _number_ - The maximum number of playlists to return. Default: 20. Minimum: 1.
  - `offset?` _number_ - The index of the first playlist to return. Default: 0 (the first object). Use with `limit` to get the next set of playlists.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `additional_types?` _string[]_ - Array of item types that your client supports besides the default track type. Valid types are: `'track'` and `'episode'`.

**🗒 Note:** The optional `fields` parameter allows you to selectively pick off only the fields you want to be present on the returned playlist object in the response body. For TypeScript users, the response body type will currently always be the full `PlaylistObject` though. Check the Spotify docs for more information on how to use this `fields` parameter.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist-cover/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { listItemsInPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await listItemsInPlaylist(client, {
    playlist_id: '59ZbFPES4DQwEjBpWHzrtC'
  });

  console.log(`Playlist contains ${body.total} items!`);
})();
```

</details>

#### `removeItemsFromPlaylist`

Remove one or more items from a user's playlist.

`removeItemsFromPlaylist(client: Fetcher, parameters: RemoveItemsFromPlaylistParameters): RemoveItemsFromPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID for the playlist.
  - `tracks` _PlaylistTrack[]_ - An array of objects containing Spotify URIs and optional positions of the tracks or episodes to remove.
  - `snapshot_id?` _string_ - The Spotify snapshot ID for the playlist.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/remove-tracks-playlist/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { removeItemsFromPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await removeItemsFromPlaylist(client, {
    playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
    tracks: [
      { uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh', positions: [0, 3] },
      { uri: 'spotify:track:1301WleyT98MSxVHPZCA6M', positions: [7] },
      { uri: 'spotify:episode:512ojhOuo1ktJprKbVcKyQ', positions: [8] }
    ]
  });

  console.log(`Playlist snapshot ID: ${body.snapshot_id}`);
})();
```

</details>

#### `reorderItemsInPlaylist`

Reorder an item or a group of items in a playlist.

`reorderItemsInPlaylist(client: Fetcher, parameters: ReorderItemsInPlaylistParameters): ReorderItemsInPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID for the playlist.
  - `range_start` _number_ - The position of the first item to be reordered.
  - `insert_before` _number_ - The position where the items should be inserted.
  - `range_length?` _number_ - The amount of items to be reordered.
  - `snapshot_id?` _number_ - The Spotify snapshot ID for the playlist.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/reorder-playlists-tracks/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { reorderItemsInPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await reorderItemsInPlaylist(client, {
    playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
    range_start: 0,
    insert_before: 4
  });

  console.log(`Playlist snapshot ID: ${body.snapshot_id}`);
})();
```

</details>

#### `replaceItemsInPlaylist`

Replace all the items in a playlist, overwriting its existing items. This powerful request can be useful for replacing items, re-ordering existing items, or clearing the playlist.

`replaceItemsInPlaylist(client: Fetcher, parameters: ReplaceItemsInPlaylistParameters): ReplaceItemsInPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `playlist_id` _string_ - The Spotify ID for the playlist.
  - `uris?` _string[]_ - Array of Spotify URIs. A maximum of 100 items can be set in one request. If this parameter is not provided, all playlist items will be cleared.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/replace-playlists-tracks/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { replaceItemsInPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await replaceItemsInPlaylist(client, {
    playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
    uris: [
      'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
      'spotify:track:1301WleyT98MSxVHPZCA6M',
      'spotify:episode:512ojhOuo1ktJprKbVcKyQ'
    ]
  });
})();
```

</details>

#### `uploadCoverImageForPlaylist`

Replace the image used to represent a specific playlist.

`uploadCoverImageForPlaylist(client: Fetcher, parameters: UploadCoverImageForPlaylistParameters): UploadCoverImageForPlaylistResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `parameters.playlist_id` _string_ - The Spotify ID for the playlist.
  - `parameters.image` _string_ - Base64 encoded JPEG image data, maximum payload size is 256 KB.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/playlists/upload-custom-playlist-cover/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { uploadCoverImageForPlaylist } from 'spotify-api-client/playlists';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  await uploadCoverImageForPlaylist(client, {
    playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
    image: '/9j/4AAQSkZJRgABAQAASABI...5JMYhiBjUAY61/rUVNGiR//9k='
  });
})();
```

### `search`

#### `search`

Get Spotify Catalog information about albums, artists, playlists, tracks, shows or episodes that match a keyword string.

`search(client: Fetcher, parameters: SearchParameters): SearchResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `q` _string_ - Search query.
  - `type` _string_ - Spotify object type: one of `'album'`, `'artist'`, `'playlist'`, `'track'`, `'show'` or `'episode'`.
  - `offset?` _number_ - The index of the first result to return.
  - `limit?` _number_ - The maximum number of results to return.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `include_external?` _boolean_ - If `include_external` = audio
    is specified the response will include any relevant audio content that is hosted externally.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/search/search/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { search } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const result = await search(client, {
    q: 'album:eingya artist:helios',
    type: 'album'
  });
})();
```

</details>

#### `searchAlbums`

Perform an album-specific search against the Spotify catalog. This is a short-hand for calling [search](#search) with a `type` of `"album"`.

`searchAlbums(client: Fetcher, parameters: Omit<SearchParameters, 'type'>): SearchAlbumsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `q` _string_ - Search query.
  - `offset?` _number_ - The index of the first result to return.
  - `limit?` _number_ - The maximum number of results to return.
  - `market?` _number_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `include_external?` _boolean_ - If `include_external` = audio
    is specified the response will include any relevant audio content that is hosted externally.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/search/search/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { searchAlbums } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await searchAlbums(client, {
    q: 'Enjoy Eternal Bliss'
  });

  console.log(`Found ${body.total} results!`);
})();
```

</details>

#### `searchArtists`

Perform an artist-specific search against the Spotify catalog. This is a short-hand for calling [search](#search) with a `type` of `"artist"`.

`searchArtists(client: Fetcher, parameters: Omit<SearchParameters, 'type'>): SearchArtistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `q` _string_ - Search query.
  - `offset?` _number_ - The index of the first result to return.
  - `limit?` _number_ - The maximum number of results to return.
  - `market?` _number_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `include_external?` _boolean_ - If `include_external` = audio
    is specified the response will include any relevant audio content that is hosted externally.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/search/search/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { searchArtists } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await searchArtists(client, {
    q: 'Lambchop'
  });

  console.log(`Found ${body.total} results!`);
})();
```

</details>

#### `searchEpisodes`

Perform an episode-specific search against the Spotify catalog. This is a short-hand for calling [search](#search) with a `type` of `"episode"`.

`searchEpisodes(client: Fetcher, parameters: Omit<SearchParameters, 'type'>): SearchEpisodesResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `q` _string_ - Search query.
  - `offset?` _number_ - The index of the first result to return.
  - `limit?` _number_ - The maximum number of results to return.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `include_external?` _boolean_ - If `include_external` = audio
    is specified the response will include any relevant audio content that is hosted externally.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/search/search/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { searchEpisodes } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await searchEpisodes(client, {
    q: 'Hasty Treat'
  });

  console.log(`Found ${body.total} results!`);
})();
```

</details>

#### `searchPlaylists`

Perform a playlist-specific search against the Spotify catalog. This is a short-hand for calling [search](#search) with a `type` of `"playlist"`.

`searchPlaylists(client: Fetcher, parameters: Omit<SearchParameters, 'type'>): SearchPlaylistsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `q` _string_ - Search query.
  - `offset?` _number_ - The index of the first result to return.
  - `limit?` _number_ - The maximum number of results to return.
  - `market?` _market_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `include_external?` _boolean_ - If `include_external` = audio
    is specified the response will include any relevant audio content that is hosted externally.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/search/search/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { searchPlaylists } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await searchPlaylists(client, {
    q: 'Chillout'
  });

  console.log(`Found ${body.total} results!`);
})();
```

</details>

#### `searchShows`

Perform a show-specific search against the Spotify catalog. This is a short-hand for calling [search](#search) with a `type` of `"show"`.

`searchShows(client: Fetcher, parameters: Omit<SearchParameters, 'type'>): SearchShowsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `q` _string_ - Search query.
  - `offset?` _number_ - The index of the first result to return.
  - `limit?` _number_ - The maximum number of results to return.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `include_external?` _boolean_ - If `include_external` = audio
    is specified the response will include any relevant audio content that is hosted externally.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/search/search/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { searchShows } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await searchShows(client, {
    q: 'Athletico Mince'
  });

  console.log(`Found ${body.total} results!`);
})();
```

</details>

#### `searchTracks`

Perform a track-specific search against the Spotify catalog. This is a short-hand for calling [search](#search) with a `type` of `"track"`.

`searchTracks(client: Fetcher, parameters: Omit<SearchParameters, 'type'>): SearchTracksResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `q` _string_ - Search query.
  - `offset?` _number_ - The index of the first result to return.
  - `limit?` _number_ - The maximum number of results to return.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.
  - `include_external?` _boolean_ - If `include_external` = audio
    is specified the response will include any relevant audio content that is hosted externally.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/search/search/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { searchTracks } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await searchTracks(client, {
    q: 'Memory Arc'
  });

  console.log(`Found ${body.total} results!`);
})();
```

</details>

### `shows`

#### `getEpisodesForShow`

Get Spotify catalog information about a show's episodes.

`getEpisodesForShow(client: Fetcher, parameters: GetEpisodesForShowParameters): GetEpisodesForShowResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the show.
  - `limit?` _string_ - The maximum number of episodes to return. Default: 20. Minimum: 1. Maximum: 50.
  - `offset?` _string_ - The index of the first episode to return. Default: 0 (the first object). Use with `limit` to get the next set of episodes.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code. If country code is specified, only shows and episodes that are available in that market will be returned.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/shows/get-shows-episodes/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getEpisodesForShow } from 'spotify-api-client/search';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getEpisodesForShow({
    id: '38bS44xjbVVZ3No3ByF1dJ'
  });

  console.log(`Found ${body.shows.total} episodes!`);
})();
```

</details>

#### `getShow`

Get Spotify catalog information for a single show identified by its unique Spotify ID.

`getShow(client: Fetcher, parameters: GetShowParameters): GetShowResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the show.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code. If country code is specified, only shows and episodes that are available in that market will be returned.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/shows/get-a-show/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getShow } from 'spotify-api-client/shows';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getShow(client, {
    id: '38bS44xjbVVZ3No3ByF1dJ',
    market: 'US'
  });

  console.log(`Found show: ${body.name}!`);
})();
```

</details>

#### `getShows`

Get Spotify catalog information for multiple shows based on their Spotify IDs.

`getShows(client: Fetcher, parameters: GetShowsParameters): GetShowsResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string_ - Array of Spotify show IDs.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code. If country code is specified, only shows and episodes that are available in that market will be returned.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/shows/get-several-shows/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getShows } from 'spotify-api-client/shows';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getShows(client, {
    ids: ['5CfCWKI5pZ28U0uOzXkDHe', '5as3aKmN2k11yfDDDSrvaZ'],
    market: 'US'
  });

  body.shows.forEach((show) => {
    // `show` may be `null` here if the ID at the
    // corresponding position in the `ids` array
    // returned no results.
    if (show) {
      console.log(`Found show: ${show.name}!`);
    }
  });
})();
```

</details>

### `tracks`

#### `getAudioAnalysisForTrack`

Get a detailed audio analysis for a single track identified by its unique Spotify ID.

`getAudioAnalysisForTrack(client: Fetcher, parameters: GetAudioAnalysisForTrackParameters): GetAudioAnalysisForTrackResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the track.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getAudioAnalysisForTrack } from 'spotify-api-client/tracks';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getAudioAnalysisForTrack(client, {
    id: '3JIxjvbbDrA9ztYlNcp3yL'
  });

  console.log(`Analysis found ${body.sections.length} track sections.`);
})();
```

</details>

#### `getAudioFeaturesForTrack`

Get audio feature information for a single track identified by its unique Spotify ID.

`getAudioFeaturesForTrack(client: Fetcher, parameters: GetAudioFeaturesForTrackParameters): GetAudioFeaturesForTrackResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the track.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getAudioFeaturesForTrack } from 'spotify-api-client/tracks';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getAudioFeaturesForTrack(client, {
    id: '3JIxjvbbDrA9ztYlNcp3yL'
  });

  console.log(`Estimated track tempo: ${body.tempo} bpm`);
})();
```

</details>

#### `getAudioFeaturesForTracks`

Get audio features for multiple tracks based on their Spotify IDs.

`getAudioFeaturesForTracks(client: Fetcher, parameters: GetAudioFeaturesForTracksParameters): GetAudioFeaturesForTracksResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify track IDs. Maximum: 100 IDs.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getAudioFeaturesForTracks } from 'spotify-api-client/tracks';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getAudioFeaturesForTracks(client, {
    ids: [
      '4JpKVNYnVcJ8tuMKjAj50A',
      '2NRANZE9UCmPAS5XVbXL40',
      '24JygzOLM0EmRQeGtFcIcG'
    ]
  });

  body.audio_features.forEach((track) => {
    // `track` may be `null` here if the ID at the corresponding position
    // in the `ids` array returned no results.
    if (track) {
      console.log(`Estimated tempo for track ${track.id}: ${track.tempo} bpm`);
    }
  });
})();
```

</details>

#### `getTrack`

Get Spotify catalog information for a single track identified by its unique Spotify ID.

`getTrack(client: Fetcher, parameters: GetTrackParameters): GetTrackResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `id` _string_ - The Spotify ID for the track.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/tracks/get-track/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getTrack } from 'spotify-api-client/tracks';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = getTrack(client, {
    id: '3JIxjvbbDrA9ztYlNcp3yL'
  });

  console.log(`Found track ${track.name}!`);
})();
```

</details>

#### `getTracks`

Get Spotify catalog information for multiple tracks based on their Spotify IDs.

`getTracks(client: Fetcher, parameters: GetTracksParameters): GetTracksResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `ids` _string[]_ - Array of Spotify track IDs. Maximum: 50 IDs.
  - `market?` _string_ - An ISO 3166-1 alpha-2 country code or the string `'from_token'`.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-tracks/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getTracks } from 'spotify-api-client/tracks';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getTracks({
    ids: [
      '4JpKVNYnVcJ8tuMKjAj50A',
      '2NRANZE9UCmPAS5XVbXL40',
      '24JygzOLM0EmRQeGtFcIcG'
    ]
  });

  body.tracks.forEach((track) => {
    // `track` may be `null` here if the ID at the
    // corresponding position in the `ids` array
    // returned no results.
    if (track) {
      console.log(`Found track ${track.name}!`);
    }
  });
})();
```

</details>

### `user`

#### `me`

Get detailed profile information about the current user (including the current user's username).

`me(client: Fetcher): MeResponse`

- `client` _Fetcher_ - Client used to execute the request.

**Important!** If the `user-read-email` scope is authorized, the returned JSON will include the email address that was entered when the user created their Spotify account. This email address is unverified; do not assume that the email address belongs to the user.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { me } from 'spotify-api-client/users';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await me(client);

  console.log(body.display_name);
})();
```

</details>

#### `getUser`

Get public profile information about a Spotify user.

`getUser(client: Fetcher, parameterrs: GetUserParameters): GetUserResponse`

- `client` _Fetcher_ - Client used to execute the request.
- `parameters`
  - `user_id` _string_ - The user's Spotify user ID.

Read the [Spotify API docs](https://developer.spotify.com/documentation/web-api/reference/users-profile/get-users-profile/) for this endpoint.

<details>
<summary><strong>Example</strong></summary>

```js
import { createClient } from 'spotify-api-client';
import { fetcher } from 'spotify-api-client/fetcher';
import { createBearerAuthMiddleware } from 'spotify-api-client/middleware';
import { getUser } from 'spotify-api-client/users';

(async () => {
  const client = createClient(
    fetcher,
    createBearerAuthMiddleware({ token: 'NPrq7CF6QxVFo0eKO4aDdzV3G52R2EIMHt8' })
  );

  const { body } = await getUser(client, {
    user_id: 'user123'
  });

  console.log(body.display_name);
})();
```

</details>
