import { ILocation } from '../../common/interfaces';
import { IEmployee, IRestaurant } from '../../restaurant/interfaces';
import { IMenu } from '../../menu/interfaces';
import { IUser } from '../../user/interfaces';

interface IItemWithQuantity {
  readonly item: IMenu;
  readonly quantity: number;
  readonly itemPrice: number;
}

export interface IOrder {
  readonly _id: string;
  readonly restaurant: IRestaurant | string;
  readonly items: IItemWithQuantity[];
  readonly orderId: string;
  readonly invoice: string;
  readonly orderType: string;
  readonly orderDate: number;
  readonly tableNumber: number;
  readonly location: ILocation;
  readonly status: string;
  readonly subTotal: number;
  readonly serviceCharge: number;
  readonly grandTotal: number;
  readonly paymentStatus: string;
  readonly servedBy: IEmployee;
  readonly orderBy: IUser;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
