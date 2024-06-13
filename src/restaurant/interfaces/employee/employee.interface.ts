import { IRestaurant } from '../restaurant/restaurant.interface';
import { IUser } from '../../../user/interfaces';

export interface IEmployee {
  readonly _id: string;
  readonly user: IUser | string;
  readonly restaurant: IRestaurant | string;
  readonly isAdmin: boolean;
  readonly isBranchManager: boolean;

  readonly isOwner: boolean;
  readonly role: string;
  readonly status: string;
  readonly isPaid: boolean;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
