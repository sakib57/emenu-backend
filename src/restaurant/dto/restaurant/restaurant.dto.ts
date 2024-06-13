import {
  IsString,
  MaxLength,
  MinLength,
  IsArray,
  ValidateNested,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  LocationDTO,
  MediaDTO,
  MobileDTO,
  SocialDTO,
} from '../../../common/dto';
import { Location, Media, Mobile, Social } from '../../../common/schemas';

export class RestaurantDTO implements Readonly<RestaurantDTO> {
  @ApiProperty()
  @MaxLength(150)
  @MinLength(2)
  @IsString()
  name: string;

  @ApiProperty()
  @MaxLength(170)
  @MinLength(3)
  @IsString()
  nameSlug: string;

  @ApiProperty()
  @MaxLength(10)
  @MinLength(3)
  @IsString()
  slug: string;

  @ApiProperty()
  @MaxLength(170)
  @MinLength(3)
  @IsString()
  restaurantId: string;

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

  @ApiProperty({
    type: MediaDTO,
  })
  @Type(() => MediaDTO)
  thumbnail: Media;

  @ApiProperty({
    type: MediaDTO,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDTO)
  pictures: [Media];

  @ApiProperty({
    type: MediaDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => MediaDTO)
  videos: [Media];

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: MobileDTO,
  })
  @Type(() => MobileDTO)
  mobile: Mobile;

  @ApiProperty()
  website: string;

  @ApiProperty({
    type: SocialDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => SocialDTO)
  socials: [Social];

  @ApiProperty()
  tableCount: number;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  ratings: number;

  @ApiProperty()
  printerName: string;

  @ApiProperty()
  stripeApiKey: string;

  @ApiProperty()
  stripeApiSecret: string;

  @ApiProperty()
  printerType: string;

  @ApiProperty()
  printerInterface: string;

  @ApiProperty()
  printerCharacterSet: string;

  @ApiProperty()
  printerLineCharacter: string;

  @ApiProperty()
  removeSpecialCharacters: boolean;

  @ApiProperty()
  profilePercentage: number;

  @ApiProperty()
  serviceCharge: number;

  @ApiProperty()
  isSubscribed: boolean;

  @ApiProperty()
  isAcceptPrePayment: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  cTime: number;

  @ApiProperty()
  cBy: string;

  @ApiProperty()
  uTime: number;

  @ApiProperty()
  uBy: string;
}
