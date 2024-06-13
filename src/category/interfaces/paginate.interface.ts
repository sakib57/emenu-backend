import { IPaginate } from '../../common/interfaces';
import { ICategory } from './category.interface';
import { IRestaurant } from '../../restaurant/interfaces/restaurant/restaurant.interface';

export interface IPaginateCategory extends IPaginate {
  data: {
    categories: ICategory[];
    restaurant?: IRestaurant;
  };
  message?: string;
}
