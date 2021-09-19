import {
  Response,
  MarketOption,
  OffsetOption,
  LimitOption,
  ShowObject,
  PagingObject,
  SimplifiedEpisodeObject,
  NullableSimplifiedShows,
  IdObject,
  IdsObject
} from '../types';

export type GetShowParameters = MarketOption & IdObject;

export type GetShowResponse = Promise<Response<ShowObject>>;

export type GetShowsParameters = MarketOption & IdsObject;

export type GetShowsResponse = Promise<Response<NullableSimplifiedShows>>;

export type GetEpisodesForShowParameters = LimitOption &
  OffsetOption &
  MarketOption &
  IdObject;

export type GetEpisodesForShowResponse = Promise<
  Response<PagingObject<SimplifiedEpisodeObject>>
>;
