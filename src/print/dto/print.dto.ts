import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PrinterType } from '../../common/mock/constant.mock';

export class PrintDTO implements Readonly<PrintDTO> {
  @ApiProperty()
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  oederId: string;

  @ApiProperty({
    enum: PrinterType,
    default: 'STAR',
  })
  @IsEnum(PrinterType)
  type: PrinterType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  interface: string;

  @ApiProperty({ default: 'SLOVENIA' })
  @IsString()
  characterSet: string;

  @ApiProperty({ default: '=' })
  @IsString()
  lineCharacter: string;

  @ApiProperty({ default: false })
  @IsString()
  @IsBoolean()
  removeSpecialCharacters: boolean;
}
