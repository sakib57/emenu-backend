import {
  IsArray,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Continent, MobilePrefixes } from '../../../common/mock/constant.mock';

export class CreateCountryDTO implements Readonly<CreateCountryDTO> {
  @ApiProperty()
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  name: string;

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
}
