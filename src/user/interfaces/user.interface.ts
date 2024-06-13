import { IUserProfile } from './user-profile.interface';

export interface IUser {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly profile: IUserProfile;
  readonly otp: number;
  readonly otpExpiresAt: number;
  readonly emailProofToken: string;
  readonly emailProofTokenExpiresAt: number;
  readonly passwordResetToken: string;
  readonly passwordResetTokenExpiresAt: number;
  readonly isActive: boolean;
  readonly isSuperAdmin: boolean;
  readonly isAdmin: boolean;
  readonly isVerified: boolean;
  readonly isDeleted: boolean;
  readonly cTime: number;
  readonly cBy: string;
  readonly uTime: number;
  readonly uBy: string;
}
