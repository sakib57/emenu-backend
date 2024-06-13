import { Mobile, Social } from '../../common/schemas';
import { IUser } from './user.interface';

export interface IUserProfile {
  readonly _id: string;
  readonly user: IUser;
  readonly firstName: string;
  readonly middleName: string;
  readonly lastName: string;
  readonly bio: string;
  readonly dob: number;
  readonly gender: string;
  readonly mobile: Mobile;
  readonly location: Location;
  readonly socials: Social[];
  readonly profilePic: string;
  readonly profilePercentage: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly cTime: number;
  readonly cBy: string;
  readonly uTime: number;
  readonly uBy: string;
}
