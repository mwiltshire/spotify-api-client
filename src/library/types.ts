import {
  Response,
  LimitOption,
  OffsetOption,
  MarketOption,
  PagingObject,
  SavedAlbumObject,
  SavedShowObject,
  SavedTrackObject,
  IdsObject
} from '../types';

export type CheckLibraryParameters = IdsObject;

export type CheckLibraryResponse = Promise<Response<boolean[]>>;

export type GetSavedAlbumsParameters = LimitOption &
  OffsetOption &
  MarketOption;

export type GetSavedAlbumsResponse = Promise<
  Response<PagingObject<SavedAlbumObject>>
>;

export type GetSavedShowsParameters = LimitOption & OffsetOption;

export type GetSavedShowsResponse = Promise<
  Response<PagingObject<SavedShowObject>>
>;

export type GetSavedTracksParameters = LimitOption &
  OffsetOption &
  MarketOption;

export type GetSavedTracksResponse = Promise<
  Response<PagingObject<SavedTrackObject>>
>;

export type RemoveFromLibraryResponse = Promise<Response<void>>;

export type RemoveSavedAlbumsParameters = IdsObject;

export type RemoveSavedShowsParameters = MarketOption & IdsObject;

export type RemoveSavedTracksParameters = IdsObject;

export type SaveToLibraryParameters = IdsObject;

export type SaveToLibraryResponse = Promise<Response<void>>;
