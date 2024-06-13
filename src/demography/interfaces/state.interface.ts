import { ICity } from './city.interface';
import { ICountry } from './country.interface';

export interface IState {
  readonly _id: string;
  readonly name: string;
  readonly slug: string;
  readonly code: string;
  readonly lat: number;
  readonly lng: number;
  readonly cities: ICity[];
  readonly country: ICountry;
  readonly isCapital: boolean;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
