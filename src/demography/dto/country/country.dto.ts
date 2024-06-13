import {
  IsArray,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Continent, MobilePrefixes } from '../../../common/mock/constant.mock';

export class CountryDTO implements Readonly<CountryDTO> {
  @ApiProperty()
  @MaxLength(80)
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty()
  @MaxLength(80)
  @MinLength(3)
  @IsString()
  slug: string;

  @ApiProperty()
  @MaxLength(5)
  @MinLength(1)
  @IsString()
  code: string;

  @ApiProperty({ enum: MobilePrefixes })
  @IsEnum(MobilePrefixes)
  dialingCode: MobilePrefixes;

  @ApiProperty()
  @IsArray()
  languages: [];

  @ApiProperty({ enum: Continent })
  @IsEnum(Continent)
  continent: Continent;

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
