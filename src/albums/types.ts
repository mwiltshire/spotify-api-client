import {
  Response,
  MarketOption,
  LimitOption,
  OffsetOption,
  AlbumObject,
  NullableAlbums,
  PagingObject,
  SimplifiedTrackObject
} from '../types';

export interface GetAlbumParameters extends MarketOption {
  /** The Spotify ID for the album. */
  id: string;
}

export type GetAlbumResponse = Promise<Response<AlbumObject>>;

export interface GetAlbumTracksParameters
  extends LimitOption,
    OffsetOption,
    MarketOption {
  /** The Spotify ID for the album. */
  id: string;
}

export type GetAlbumTracksResponse = Promise<
  Response<PagingObject<SimplifiedTrackObject>>
>;

export interface GetAlbumsParameters extends MarketOption {
  /** A comma-separated list of the Spotify IDs for the albums.
   * Maximum: 20 IDs. */
  ids: string[];
}

export type GetAlbumsResponse = Promise<Response<NullableAlbums>>;
