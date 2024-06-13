import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { MediaDTO } from '../../common/dto';
import { Media } from '../../common/schemas';

export class UpdateCategoryDTO implements Readonly<UpdateCategoryDTO> {
  @ApiProperty()
  name: string;

  @ApiProperty({
    type: MediaDTO,
  })
  @Type(() => MediaDTO)
  thumbnail: Media;

  @ApiProperty({
    type: MediaDTO,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDTO)
  pictures: [Media];

  @ApiProperty({
    type: MediaDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => MediaDTO)
  videos: [Media];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  uTime: number;

  @ApiProperty()
  timezone: string;
}
