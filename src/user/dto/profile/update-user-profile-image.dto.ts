import { ApiProperty } from '@nestjs/swagger';

export class UserProfileImageUploadDTO
  implements Readonly<UserProfileImageUploadDTO>
{
  @ApiProperty({ type: 'string', format: 'binary' })
  proPic: Express.Multer.File;
}
