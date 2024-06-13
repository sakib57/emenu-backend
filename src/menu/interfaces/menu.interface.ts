import { IMedia } from '../../common/interfaces';
import { IRestaurant } from '../../restaurant/interfaces';

export interface IMenu {
  readonly _id: string;
  readonly item: string;
  readonly price: number;
  readonly ingredients: string[];
  readonly restaurant: IRestaurant | string;
  readonly description: string;
  readonly thumbnail: IMedia;
  readonly pictures: IMedia[];
  readonly videos: IMedia[];
  readonly ratings: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
