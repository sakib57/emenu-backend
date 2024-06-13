import { IPaginate } from '../../common/interfaces';
import { IMenu } from './menu.interface';
import { IRestaurant } from '../../restaurant/interfaces';

export interface IPaginateMenu extends IPaginate {
  data: {
    menus: IMenu[];
    restaurant?: IRestaurant;
  };
  message?: string;
}
