import {
  Response,
  ArtistObject,
  Artists,
  NullableArtists,
  PagingObject,
  SimplifiedAlbumObject,
  Tracks,
  LimitOption,
  OffsetOption,
  CountryOption
} from '../types';

export interface GetArtistParameters {
  /** The Spotify ID for the artist. */
  id: string;
}

export type GetArtistResponse = Promise<Response<ArtistObject>>;

export interface GetAlbumsForArtistParameters
  extends LimitOption,
    OffsetOption,
    CountryOption {
  /** The Spotify ID for the artist. */
  id: string;
  /** Array of keywords that will be used to filter the response.
   * If not supplied, all album types will be returned.
   * Valid values are: album, single, appears_on, compilation */
  include_groups?: Array<'album' | 'single' | 'appears_on' | 'compilation'>;
}

export type GetAlbumsForArtistResponse = Promise<
  Response<PagingObject<SimplifiedAlbumObject>>
>;

export interface GetTopTracksForArtistParameters
  extends Required<CountryOption> {
  /** The Spotify ID for the artist. */
  id: string;
}

export type GetTopTracksForArtistResponse = Promise<Response<Tracks>>;

export interface GetRelatedArtistsForArtistParameters {
  /** The Spotify ID for the artist. */
  id: string;
}

export type GetRelatedArtistsForArtistResponse = Promise<Response<Artists>>;

export interface GetArtistsParameters {
  /** Array of Spotify IDs for the artists. Maximum: 50 IDs. */
  ids: string[];
}

export type GetArtistsResponse = Promise<Response<NullableArtists>>;
