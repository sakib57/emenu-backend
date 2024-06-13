import {
  IsMongoId,
  MaxLength,
  MinLength,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaDTO } from '../../common/dto';
import { Type } from 'class-transformer';
import { Media } from '../../common/schemas';

class AddonWithPriceDTO {
  @ApiProperty()
  item: string;

  @ApiProperty()
  price: number;
}

export class MenuDTO implements Readonly<MenuDTO> {
  @ApiProperty()
  @IsMongoId()
  @IsString()
  category: string;

  @ApiProperty()
  @MaxLength(150)
  @MinLength(2)
  @IsString()
  item: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  ingredients: string[];

  @ApiProperty()
  @IsMongoId()
  restaurant: string;

  @ApiProperty()
  @MaxLength(5000)
  @MinLength(3)
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  allergy: string[];

  @ApiProperty({
    type: AddonWithPriceDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => AddonWithPriceDTO)
  addOns: [AddonWithPriceDTO];

  @ApiProperty({
    type: MediaDTO,
  })
  @Type(() => MediaDTO)
  thumbnail: Media;

  @ApiProperty({
    type: MediaDTO,
  })
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
  ratings: number;

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
