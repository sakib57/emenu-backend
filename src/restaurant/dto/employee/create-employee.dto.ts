import { IsMongoId, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType, Status } from '../../../common/mock/constant.mock';

export class CreateEmployeeDTO implements Readonly<CreateEmployeeDTO> {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsMongoId()
  user: string;

  @ApiProperty()
  @IsMongoId()
  restaurant: string;

  @ApiProperty({
    enum: Status,
  })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    enum: RoleType,
  })
  @IsEnum(RoleType)
  role: RoleType;

  @ApiProperty()
  isOwner: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  isBranchManager: boolean;

  @ApiProperty()
  isPaid: boolean;

  @ApiProperty()
  timezone: string;
}
