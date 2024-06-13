import { IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MobilePrefixes } from '../../../common/mock/constant.mock';

export class UpdateCountryDTO implements Readonly<UpdateCountryDTO> {
  @ApiProperty({ enum: MobilePrefixes })
  @IsEnum(MobilePrefixes)
  dialingCode: MobilePrefixes;

  @ApiProperty()
  @IsArray()
  languages: [];
}
