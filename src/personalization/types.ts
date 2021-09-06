import {
  Response,
  LimitOption,
  OffsetOption,
  ArtistObject,
  PagingObject,
  TrackObject
} from '../types';

export interface GetMyTopArtistsOrTracksParameters
  extends LimitOption,
    OffsetOption {
  /** Over what time frame the affinities are computed.
   * Valid values: long_term (calculated from several
   * years of data and including all new data as it
   * becomes available), medium_term (approximately
   * last 6 months), short_term (approximately last
   * 4 weeks). Default: medium_term. */
  time_range?: 'short_term' | 'medium_term' | 'long_term';
}

export type GetMyTopArtistsResponse = Promise<
  Response<PagingObject<ArtistObject>>
>;

export type GetMyTopTracksResponse = Promise<
  Response<PagingObject<TrackObject>>
>;
