import {
  Response,
  CountryOption,
  LimitOption,
  OffsetOption,
  LocaleOption,
  MarketOption,
  CategoryObject,
  RecommendationsObject,
  CategoryIdObject,
  PagingSimplifiedPlaylistsObject,
  PagingCategoriesObject,
  MessageObject,
  PagingSimplifiedAlbumsObject,
  GenresObject
} from '../types';

export type GetCategoryParameters = CountryOption &
  LocaleOption &
  CategoryIdObject;

export type GetCategoryResponse = Promise<Response<CategoryObject>>;

export type GetPlaylistsForCategoryParameters = CountryOption &
  LimitOption &
  OffsetOption &
  CategoryIdObject;

export type GetPlaylistsForCategoryResponse = Promise<
  Response<PagingSimplifiedPlaylistsObject>
>;

export interface GetCategoriesParameters
  extends CountryOption,
    LocaleOption,
    LimitOption,
    OffsetOption {}

export type GetCategoriesResponse = Promise<Response<PagingCategoriesObject>>;

export interface GetFeaturedPlaylistsParameters
  extends LocaleOption,
    CountryOption,
    LimitOption,
    OffsetOption {
  /** A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss */
  timestamp?: string;
}

export type GetFeaturedPlaylistsResponse = Promise<
  Response<PagingSimplifiedPlaylistsObject & MessageObject>
>;

export interface GetNewReleasesParameters
  extends CountryOption,
    LimitOption,
    OffsetOption {}

export type GetNewReleasesResponse = Promise<
  Response<PagingSimplifiedAlbumsObject & MessageObject>
>;

/**
 * See endpoint documentation for in-depth descriptions for
 * parameters: https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
 */
export interface GetRecommendationsParameters
  extends LimitOption,
    MarketOption {
  max_acousticness?: number;
  max_danceability?: number;
  max_duration_ms?: number;
  max_energy?: number;
  max_instrumentalness?: number;
  max_key?: number;
  max_liveness?: number;
  max_loudness?: number;
  max_mode?: number;
  max_popularity?: number;
  max_speechiness?: number;
  max_tempo?: number;
  max_time_signature?: number;
  max_valence?: number;
  min_acousticness?: number;
  min_danceability?: number;
  min_duration_ms?: number;
  min_energy?: number;
  min_instrumentalness?: number;
  min_key?: number;
  min_liveness?: number;
  min_loudness?: number;
  min_mode?: number;
  min_popularity?: number;
  min_speechiness?: number;
  min_tempo?: number;
  min_time_signature?: number;
  min_valence?: number;
  seed_artists?: string[];
  seed_genres?: string[];
  seed_tracks?: string[];
  target_acousticness?: number;
  target_danceability?: number;
  target_duration_ms?: number;
  target_energy?: number;
  target_instrumentalness?: number;
  target_key?: number;
  target_liveness?: number;
  target_loudness?: number;
  target_mode?: number;
  target_popularity?: number;
  target_speechiness?: number;
  target_tempo?: number;
  target_time_signature?: number;
  target_valence?: number;
}

export type GetRecommendationsResponse = Promise<
  Response<RecommendationsObject>
>;

export type GetRecommendationGenresResponse = Promise<Response<GenresObject>>;
