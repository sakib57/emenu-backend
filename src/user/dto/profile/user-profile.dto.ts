import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MobileDTO } from '../../../common/dto';
import { Mobile } from '../../../common/schemas';
import { LocationDTO } from '../../../common/dto';
import { Location } from '../../../common/schemas';
import { Social } from '../../../common/schemas';

export class UserProfileDto implements Readonly<UserProfileDto> {
  @ApiProperty()
  user: string;

  @ApiProperty()
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  firstName: string;

  @ApiProperty()
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  middleName: string;

  @ApiProperty()
  @MaxLength(30)
  @MinLength(3)
  @Matches(/^[a-zA-Z ]+$/)
  @IsString()
  lastName: string;

  @ApiProperty()
  @MaxLength(120)
  @MinLength(2)
  @IsString()
  bio: string;

  @ApiProperty()
  dob: number;

  @ApiProperty()
  gender: string;

  @ApiProperty({
    type: MobileDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => MobileDTO)
  mobile: Mobile;

  @ApiProperty({
    type: LocationDTO,
  })
  @Type(() => LocationDTO)
  location: Location;

  @ApiProperty({
    type: [Social],
  })
  @IsArray()
  socials: [Social];

  @ApiProperty()
  profilePic: string;

  @ApiProperty({ default: 0 })
  profilePercentage: number;

  @ApiProperty({ default: true })
  isActive: boolean;

  @ApiProperty({ default: false })
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
