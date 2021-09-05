import * as ENDPOINTS from './endpoints';
import { get } from '../http/request';
import { formatPathParams } from '../utils';
import {
  GetCategoryParameters,
  GetCategoryParametersResponse,
  GetPlaylistsForCategoryParameters,
  GetPlaylistsForCategoryResponse,
  GetCategoriesParameters,
  GetCategoriesResponse,
  GetFeaturedPlaylistsParameters,
  GetFeaturedPlaylistsResponse,
  GetNewReleasesParameters,
  GetNewReleasesResponse,
  GetRecommendationsParameters,
  GetRecommendationsResponse,
  GetRecommendationGenresResponse
} from './types';
import { Fetcher } from '../types';

export function getCategory(
  client: Fetcher,
  parameters: GetCategoryParameters
): GetCategoryParametersResponse {
  const { category_id, ...rest } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.CATEGORY,
    parameters: { category_id }
  });
  return client(get({ url, params: rest }));
}

export function getPlaylistsForCategory(
  client: Fetcher,
  parameters: GetPlaylistsForCategoryParameters
): GetPlaylistsForCategoryResponse {
  const { category_id, ...rest } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLISTS_FOR_CATEGORY,
    parameters: { category_id }
  });
  return client(get({ url, params: rest }));
}

export function getCategories(
  client: Fetcher,
  parameters: GetCategoriesParameters = {}
): GetCategoriesResponse {
  return client(get({ url: ENDPOINTS.CATEGORIES, params: parameters }));
}

export function getFeaturedPlaylists(
  client: Fetcher,
  parameters: GetFeaturedPlaylistsParameters = {}
): GetFeaturedPlaylistsResponse {
  return client(
    get({
      url: ENDPOINTS.FEATURED_PLAYLISTS,
      params: parameters
    })
  );
}

export function getNewReleases(
  client: Fetcher,
  parameters: GetNewReleasesParameters = {}
): GetNewReleasesResponse {
  return client(get({ url: ENDPOINTS.NEW_RELEASES, params: parameters }));
}

export function getRecommendations(
  client: Fetcher,
  parameters: GetRecommendationsParameters
): GetRecommendationsResponse {
  return client(
    get({
      url: ENDPOINTS.RECOMMENDATIONS,
      params: parameters
    })
  );
}

export function getRecommendationGenres(
  client: Fetcher
): GetRecommendationGenresResponse {
  return client(get({ url: ENDPOINTS.RECOMMENDATION_GENRES }));
}
