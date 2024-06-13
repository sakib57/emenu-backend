import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SocialAuthDTO {
  @ApiProperty()
  @IsEmail()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly provider: string;

  @ApiProperty()
  @IsString()
  readonly providerId: string;
}
