import {
  Response,
  MarketOption,
  LimitOption,
  OffsetOption,
  AlbumObject,
  NullableAlbums,
  PagingObject,
  SimplifiedTrackObject,
  IdObject,
  IdsObject
} from '../types';

export type GetAlbumParameters = MarketOption & IdObject;

export type GetAlbumResponse = Promise<Response<AlbumObject>>;

export type GetTracksForAlbumParameters = LimitOption &
  OffsetOption &
  MarketOption &
  IdObject;

export type GetTracksForAlbumResponse = Promise<
  Response<PagingObject<SimplifiedTrackObject>>
>;

export type GetAlbumsParameters = MarketOption & IdsObject;

export type GetAlbumsResponse = Promise<Response<NullableAlbums>>;
