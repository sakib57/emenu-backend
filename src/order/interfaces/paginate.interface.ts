import { IPaginate } from '../../common/interfaces';
import { IOrder } from './order.interface';
import { IRestaurant } from '../../restaurant/interfaces';

export interface IPaginateOrder extends IPaginate {
  data: {
    orders: IOrder[];
    restaurant?: IRestaurant;
  };
  message?: string;
}
