import { IRestaurant } from '../../restaurant/interfaces';

export interface ICategory {
  readonly _id: string;
  readonly restaurant: IRestaurant | string;
  readonly name: string;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
