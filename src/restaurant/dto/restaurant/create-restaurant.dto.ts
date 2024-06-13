import {
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LocationDTO, MobileDTO } from '../../../common/dto';
import { Location, Mobile } from '../../../common/schemas';

export class CreateRestaurantDTO implements Readonly<CreateRestaurantDTO> {
  @ApiProperty()
  @MaxLength(150)
  @MinLength(2)
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(5000)
  @IsString()
  description: string;

  @ApiProperty({
    type: LocationDTO,
  })
  @Type(() => LocationDTO)
  location: Location;

  @ApiProperty()
  @MaxLength(150)
  @MinLength(3)
  @IsString()
  tagLine: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: MobileDTO,
  })
  @Type(() => MobileDTO)
  mobile: Mobile;

  @ApiProperty()
  tableCount: number;

  @ApiProperty()
  profilePercentage: number;

  @ApiProperty()
  serviceCharge: number;

  @ApiProperty()
  isSubscribed: boolean;

  @ApiProperty()
  isAcceptPrePayment: boolean;

  @ApiProperty()
  timezone: string;
}
