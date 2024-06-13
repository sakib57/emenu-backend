import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StateDTO implements Readonly<StateDTO> {
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

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  @IsMongoId()
  country: string;

  @ApiProperty({ default: false })
  isCapital: boolean;

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
