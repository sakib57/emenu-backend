import { ApiProperty } from '@nestjs/swagger';

export class UpdateCityDTO implements Readonly<UpdateCityDTO> {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty({ default: false })
  isCapital: boolean;

  @ApiProperty({ default: false })
  isStateCapital: boolean;
}
