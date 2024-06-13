import { IsArray, IsMongoId, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaDTO } from '../../common/dto';
import { Type } from 'class-transformer';
import { Media } from '../../common/schemas';

export class CategoryDTO implements Readonly<CategoryDTO> {
  @ApiProperty()
  @IsMongoId()
  restaurant: string;

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
  cTime: number;

  @ApiProperty()
  cBy: string;

  @ApiProperty()
  uTime: number;

  @ApiProperty()
  uBy: string;
}
