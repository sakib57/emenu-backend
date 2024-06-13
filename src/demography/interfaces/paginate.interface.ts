import { ICity, ICountry, IState } from '.';
import { IPaginate } from '../../common/interfaces';

export interface IPaginatedCountry extends IPaginate {
  data: ICountry[];
}

export interface IPaginatedState extends IPaginate {
  data: IState[];
}

export interface IPaginatedCity extends IPaginate {
  data: ICity[];
}
