import {
  Response,
  LimitOption,
  PagingOption,
  MarketOption,
  PagingObject,
  SimplifiedAlbumObject,
  ArtistObject,
  TrackObject,
  SimplifiedShowObject,
  SimplifiedEpisodeObject,
  SimplifiedPlaylistObject
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

export interface TypeSpecificSearchQueryParameters
  extends Omit<SearchParameters, 'type'> {
  q: string;
}

export interface AlbumSearchResult {
  albums: PagingObject<SimplifiedAlbumObject>;
}

export interface ArtistSearchResult {
  artists: PagingObject<ArtistObject>;
}

export interface TrackSearchResult {
  tracks: PagingObject<TrackObject>;
}

export interface ShowSearchResult {
  shows: PagingObject<SimplifiedShowObject>;
}

export interface EpisodeSearchResult {
  episodes: PagingObject<SimplifiedEpisodeObject>;
}

export interface PlaylistSearchResult {
  playlists: PagingObject<SimplifiedPlaylistObject>;
}

export interface SearchResult
  extends AlbumSearchResult,
    ArtistSearchResult,
    TrackSearchResult,
    ShowSearchResult,
    EpisodeSearchResult,
    PlaylistSearchResult {}

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
    ? ArtistSearchResult
    : T extends 'album'
    ? AlbumSearchResult
    : T extends 'playlist'
    ? PlaylistSearchResult
    : T extends 'show'
    ? ShowSearchResult
    : T extends 'track'
    ? TrackSearchResult
    : T extends 'episode'
    ? EpisodeSearchResult
    : never;

export type SearchAlbumsResponse = Promise<Response<AlbumSearchResult>>;

export type SearchArtistsResponse = Promise<Response<ArtistSearchResult>>;

export type SearchEpisodesResponse = Promise<Response<EpisodeSearchResult>>;

export type SearchPlaylistsResponse = Promise<Response<PlaylistSearchResult>>;

export type SearchShowsResponse = Promise<Response<ShowSearchResult>>;

export type SearchTracksResponse = Promise<Response<TrackSearchResult>>;

export type SearchResponse<T extends SearchType | SearchType[]> = Promise<
  Response<PickSearchResult<T>>
>;
