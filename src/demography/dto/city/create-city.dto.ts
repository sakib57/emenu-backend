import { IsString, MaxLength, MinLength, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDTO implements Readonly<CreateCityDTO> {
  @ApiProperty()
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty()
  areaCode: number;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  @IsMongoId()
  state: string;

  @ApiProperty()
  @IsMongoId()
  country: string;

  @ApiProperty({ default: false })
  isCapital: boolean;

  @ApiProperty({ default: false })
  isStateCapital: boolean;
}
