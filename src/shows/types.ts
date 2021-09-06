import {
  Response,
  MarketOption,
  OffsetOption,
  LimitOption,
  ShowObject,
  PagingObject,
  SimplifiedEpisodeObject,
  NullableSimplifiedShows
} from '../types';

export interface GetShowParameters extends MarketOption {
  /** The Spotify ID for the show. */
  id: string;
}

export type GetShowResponse = Promise<Response<ShowObject>>;

export interface GetShowsParameters extends MarketOption {
  /** Array of Spotify show IDs. */
  ids: string[];
}

export type GetShowsResponse = Promise<Response<NullableSimplifiedShows>>;

export interface GetEpisodesForShowParameters
  extends LimitOption,
    OffsetOption,
    MarketOption {
  /** The Spotify ID for the show. */
  id: string;
}

export type GetEpisodesForShowResponse = Promise<
  Response<PagingObject<SimplifiedEpisodeObject>>
>;
