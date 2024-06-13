import { ApiProperty } from '@nestjs/swagger';

export class UpdateStateDTO implements Readonly<UpdateStateDTO> {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty({ default: false })
  isCapital: boolean;
}
