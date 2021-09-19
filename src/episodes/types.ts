import {
  Response,
  MarketOption,
  EpisodeObject,
  NullableEpisodes,
  IdObject,
  IdsObject
} from '../types';

export type GetEpisodeParameters = MarketOption & IdObject;

export type GetEpisodeResponse = Promise<Response<EpisodeObject>>;

export type GetEpisodesParameters = MarketOption & IdsObject;

export type GetEpisodesResponse = Promise<Response<NullableEpisodes>>;
