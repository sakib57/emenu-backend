import { IPaginate } from '../../../common/interfaces';
import { IRestaurant } from './restaurant.interface';

export interface IPaginateRestaurant extends IPaginate {
  data: IRestaurant[];
  message?: string;
}
