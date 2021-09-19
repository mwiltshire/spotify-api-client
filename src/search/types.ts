import {
  Response,
  LimitOption,
  PagingOption,
  MarketOption,
  PagingArtistsObject,
  PagingSimplifiedAlbumsObject,
  PagingSimplifiedEpisodesObject,
  PagingSimplifiedPlaylistsObject,
  PagingSimplifiedShowsObject,
  PagingTracksObject
} from '../types';

export type SearchType =
  | 'album'
  | 'artist'
  | 'playlist'
  | 'track'
  | 'show'
  | 'episode';

export interface SearchParameters<T = SearchType | SearchType[]>
  extends LimitOption,
    PagingOption,
    MarketOption {
  q: string;
  type: T;
  include_external?: 'audio';
}

export type SearchResult = PagingSimplifiedAlbumsObject &
  PagingArtistsObject &
  PagingTracksObject &
  PagingSimplifiedShowsObject &
  PagingSimplifiedEpisodesObject &
  PagingSimplifiedPlaylistsObject;

type MapSearchResultTypes<T> = T extends 'artist'
  ? 'artists'
  : T extends 'album'
  ? 'albums'
  : T extends 'playlist'
  ? 'playlists'
  : T extends 'show'
  ? 'shows'
  : T extends 'track'
  ? 'tracks'
  : T extends 'episode'
  ? 'episodes'
  : never;

type PickSearchResultType<T extends SearchType> = {
  [K in MapSearchResultTypes<T>]: SearchResult[K];
};

export type PickSearchResult<T extends SearchType | SearchType[]> =
  T extends SearchType[]
    ? PickSearchResultType<T[number]>
    : T extends 'artist'
    ? PagingArtistsObject
    : T extends 'album'
    ? PagingSimplifiedAlbumsObject
    : T extends 'playlist'
    ? PagingSimplifiedPlaylistsObject
    : T extends 'show'
    ? PagingSimplifiedShowsObject
    : T extends 'track'
    ? PagingTracksObject
    : T extends 'episode'
    ? PagingSimplifiedEpisodesObject
    : never;

export type SearchAlbumsResponse = Promise<
  Response<PagingSimplifiedAlbumsObject>
>;

export type SearchArtistsResponse = Promise<Response<PagingArtistsObject>>;

export type SearchEpisodesResponse = Promise<
  Response<PagingSimplifiedEpisodesObject>
>;

export type SearchPlaylistsResponse = Promise<
  Response<PagingSimplifiedPlaylistsObject>
>;

export type SearchShowsResponse = Promise<
  Response<PagingSimplifiedShowsObject>
>;

export type SearchTracksResponse = Promise<Response<PagingTracksObject>>;

export type SearchResponse<T extends SearchType | SearchType[]> = Promise<
  Response<PickSearchResult<T>>
>;
