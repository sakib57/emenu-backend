import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO implements Readonly<UserDTO> {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(5)
  @Matches(/^[^\s]+(\s+[^\s]+)*$/)
  password: string;

  @ApiProperty()
  otp: number;

  @ApiProperty()
  otpExpiresAt: number;

  @ApiProperty()
  emailProofToken: string;

  @ApiProperty()
  emailProofTokenExpiresAt: number;

  @ApiProperty()
  passwordResetToken: string;

  @ApiProperty()
  passwordResetTokenExpiresAt: number;

  @ApiProperty()
  isMerchant: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  isRegistered: boolean;

  @ApiProperty()
  profilePic: string;

  @ApiProperty()
  cTime: number;

  @ApiProperty()
  cBy: string;

  @ApiProperty()
  uTime: number;

  @ApiProperty()
  uBy: string;
}
