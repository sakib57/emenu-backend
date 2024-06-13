import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType, Status } from '../../../common/mock/constant.mock';

export class UpdateEmployeeDTO implements Readonly<UpdateEmployeeDTO> {
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
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  timezone: string;
}
