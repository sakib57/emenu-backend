import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SocialMedia } from '../mock/constant.mock';

export class SocialDTO implements Readonly<SocialDTO> {
  @ApiProperty({ enum: SocialMedia })
  @IsEnum(SocialMedia)
  type: SocialMedia;

  @ApiProperty()
  @MaxLength(300)
  @MinLength(5)
  @IsString()
  url: string;

  @ApiProperty()
  isDeleted: boolean;
}
