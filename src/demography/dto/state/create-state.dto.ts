import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStateDTO implements Readonly<CreateStateDTO> {
  @ApiProperty()
  @MaxLength(200)
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty()
  @MaxLength(20)
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
}
