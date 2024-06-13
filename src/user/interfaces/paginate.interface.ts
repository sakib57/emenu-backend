import { IPaginate } from '../../common/interfaces';
import { IUser } from './user.interface';

export interface IPaginateUser extends IPaginate {
  data: {
    users: IUser[];
  };
  message?: string;
}
