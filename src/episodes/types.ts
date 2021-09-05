import {
  Response,
  MarketOption,
  EpisodeObject,
  NullableEpisodes
} from '../types';

export interface GetEpisodeParameters extends MarketOption {
  /** The Spotify ID for the episode. */
  id: string;
}

export type GetEpisodeResponse = Promise<Response<EpisodeObject>>;

export interface GetEpisodesParameters extends MarketOption {
  /** Array of the Spotify IDs for the episodes.
   * Maximum: 50 IDs. */
  ids: string[];
}

export type GetEpisodesResponse = Promise<Response<NullableEpisodes>>;
