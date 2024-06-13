import { IPaginate } from '../../../common/interfaces';
import { IEmployee } from './employee.interface';
import { IRestaurant } from '../restaurant/restaurant.interface';

export interface IPaginateEmployee extends IPaginate {
  data: {
    employees: IEmployee[];
    restaurant?: IRestaurant;
  };
  message?: string;
}
