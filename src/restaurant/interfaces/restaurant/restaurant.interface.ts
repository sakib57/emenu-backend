import { Mobile, Social } from '../../../common/schemas';
import { ILocation, IMedia } from '../../../common/interfaces';

export interface IRestaurant {
  readonly _id: string;
  readonly name: string;
  readonly nameSlug: string;
  readonly slug: string;
  readonly restaurantId: string;
  readonly description: string;
  readonly location: ILocation;
  readonly tagLine: string;
  readonly thumbnail: IMedia;
  readonly pictures: IMedia[];
  readonly videos: IMedia[];
  readonly email: string;
  readonly mobile: Mobile;
  readonly website: string;
  readonly socials: Social[];
  readonly viewCount: number;
  readonly tableCount: number;
  readonly ratings: number;
  readonly profilePercentage: number;
  readonly serviceCharge: number;
  readonly printerName: string;
  readonly stripeApiKey: string;
  readonly stripeApiSecret: string;
  readonly printerType: string;
  readonly printerInterface: string;
  readonly printerCharacterSet: string;
  readonly printerLineCharacter: string;
  readonly removeSpecialCharacters: boolean;
  readonly isSubscribed: boolean;
  readonly isAcceptPrePayment: boolean;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
}
