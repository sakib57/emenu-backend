import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MobileDTO implements Readonly<MobileDTO> {
  @ApiProperty()
  @MaxLength(6)
  @MinLength(1)
  @IsString()
  countryCode: string;

  @ApiProperty()
  @MaxLength(6)
  @MinLength(15)
  @IsString()
  mobile: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isVisible: boolean;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  isDeleted: boolean;
}
