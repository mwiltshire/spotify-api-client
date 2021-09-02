import { RequestConfig, Response } from './http';

export type Fetcher = (request: RequestConfig) => Promise<Response<any>>;

export type MaybePromise<T> = T | Promise<T>;

export interface PagingOption {
  /** The index of the first result to return. */
  offset?: number;
}

export interface LimitOption {
  /** Maximum number of results to return. */
  limit?: number;
}

export interface MarketOption {
  /** An ISO 3166-1 alpha-2 country code or the string 'from_token'. */
  market?: string;
}

export interface DeviceIdOption {
  /** The id of the device this command is targeting. */
  device_id?: string;
}

export interface OffsetOption {
  /** The index of the first result to return. */
  offset?: number;
}

export interface CountryOption {
  /** An ISO 3166-1 alpha-2 country code or the string from_token. */
  country?: string;
}

export interface LocaleOption {
  /** The desired language, consisting of an ISO 639-1 language code
   * and an ISO 3166-1 alpha-2 country code, joined by an underscore.
   * For example: es_MX, meaning "Spanish (Mexico)". */
  locale?: string;
}

export interface AfterOption {
  /** The last artist ID retrieved from the previous request. */
  after?: string;
}

export type DeviceType =
  | 'Computer'
  | 'Tablet'
  | 'Smartphone'
  | 'Speaker'
  | 'TV'
  | 'AVR'
  | 'STB'
  | 'AudioDongle'
  | 'GameConsole'
  | 'CastVideo'
  | 'CastAudio'
  | 'Automobile'
  | 'Unknown';
