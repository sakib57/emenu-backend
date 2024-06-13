import {
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Mobile } from '../../../common/schemas';
import { Social } from '../../../common/schemas';
import { Location } from '../../../common/schemas';
import { MobileDTO } from '../../../common/dto';
import { LocationDTO } from '../../../common/dto';

export class UpdateUserProfileDTO implements Readonly<UpdateUserProfileDTO> {
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
  isAdmin: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isDeleted: boolean;
}
