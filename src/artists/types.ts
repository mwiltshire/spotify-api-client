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
  CountryOption,
  MarketOption,
  IdObject,
  IdsObject
} from '../types';

export type GetArtistParameters = IdObject;

export type GetArtistResponse = Promise<Response<ArtistObject>>;

export interface GetAlbumsForArtistParameters
  extends LimitOption,
    OffsetOption,
    CountryOption,
    IdObject {
  /** Array of keywords that will be used to filter the response.
   * If not supplied, all album types will be returned.
   * Valid values are: album, single, appears_on, compilation */
  include_groups?: Array<'album' | 'single' | 'appears_on' | 'compilation'>;
}

export type GetAlbumsForArtistResponse = Promise<
  Response<PagingObject<SimplifiedAlbumObject>>
>;

export type GetTopTracksForArtistParameters = Required<MarketOption> & IdObject;

export type GetTopTracksForArtistResponse = Promise<Response<Tracks>>;

export type GetRelatedArtistsForArtistParameters = IdObject;

export type GetRelatedArtistsForArtistResponse = Promise<Response<Artists>>;

export type GetArtistsParameters = IdsObject;

export type GetArtistsResponse = Promise<Response<NullableArtists>>;
