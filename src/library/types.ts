import {
  Response,
  LimitOption,
  OffsetOption,
  MarketOption,
  PagingObject,
  SavedAlbumObject,
  SavedShowObject,
  SavedTrackObject
} from '../types';

export interface SpotifyIds {
  /** Array of Spotify IDs. Maximum: 50 IDs. */
  ids: string[];
}

export type CheckLibraryParameters = SpotifyIds;

export type CheckLibraryResponse = Promise<Response<boolean[]>>;

export interface GetSavedAlbumsParameters
  extends LimitOption,
    OffsetOption,
    MarketOption {}

export type GetSavedAlbumsResponse = Promise<
  Response<PagingObject<SavedAlbumObject>>
>;

export interface GetSavedShowsParameters extends LimitOption, OffsetOption {}

export type GetSavedShowsResponse = Promise<
  Response<PagingObject<SavedShowObject>>
>;

export interface GetSavedTracksParameters
  extends LimitOption,
    OffsetOption,
    MarketOption {}

export type GetSavedTracksResponse = Promise<
  Response<PagingObject<SavedTrackObject>>
>;

export type RemoveFromLibraryResponse = Promise<Response<void>>;

export type RemoveSavedAlbumsParameters = SpotifyIds;

export interface RemoveSavedShowsParameters extends MarketOption, SpotifyIds {}

export type RemoveSavedTracksParameters = SpotifyIds;

export type SaveToLibraryParameters = SpotifyIds;

export type SaveToLibraryResponse = Promise<Response<void>>;
